const MENU_URL = "https://justeatbharat.com/api/petpooja/menu";
const FALLBACK_IMAGE = "/images/food-placeholder.jpg";

const ATTRIBUTE_VEG = "1";
const ATTRIBUTE_NON_VEG = "2";
const ATTRIBUTE_EGG = "24";

const safeArray = (value) => (Array.isArray(value) ? value : []);

const toString = (value) => String(value ?? "").trim();

const toNumber = (value) => {
    const n = Number.parseFloat(toString(value));
    return Number.isFinite(n) ? n : 0;
};

const normalizePrice = (value) => {
    const raw = toString(value);
    const n = toNumber(raw);
    if (!Number.isFinite(n)) return 0;

    // Petpooja sometimes returns paise as an integer-like string.
    // Heuristic: if no decimal point and value is unusually large, treat as paise.
    if (raw && !raw.includes(".") && Number.isInteger(n) && n >= 1000) {
        return n / 100;
    }
    return n;
};

const normalizeImage = (value) => {
    const img = toString(value);
    return img ? img : FALLBACK_IMAGE;
};

const mapStock = (value) => {
    const n = Number.parseInt(toString(value), 10);
    if (n === 2) return "available";
    if (n === 1) return "limited";
    return "out_of_stock";
};

const extractCuisineNames = (value) => {
    const arr = safeArray(value);
    if (!arr.length) return [];
    return arr
        .map((c) => {
            if (typeof c === "string") return c.trim();
            return toString(c?.cuisinename ?? c?.name);
        })
        .filter(Boolean);
};

const extractTags = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((t) => {
                if (typeof t === "string") return t.trim();
                return toString(t?.tag ?? t?.name);
            })
            .filter(Boolean);
    }

    const s = toString(value);
    if (!s) return [];
    return s
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
};

const mapVariants = (variationValue) => {
    return safeArray(variationValue)
        .map((v) => ({
            id: toString(v?.variationid ?? v?.id),
            name: toString(v?.name),
            price: normalizePrice(v?.price),
        }))
        .filter((v) => v.name);
};

const mapAddons = (addonValue) => {
    return safeArray(addonValue)
        .map((a) => ({
            id: toString(a?.id ?? a?.addonid),
            name: toString(a?.name),
            price: normalizePrice(a?.price),
        }))
        .filter((a) => a.name);
};

export const groupMenuByCategory = (categories, items) => {
    const safeCategories = safeArray(categories);
    const safeItems = safeArray(items);

    const itemsByCategoryId = new Map();
    for (const item of safeItems) {
        const categoryId = item?.categoryId ?? "";
        if (!itemsByCategoryId.has(categoryId)) itemsByCategoryId.set(categoryId, []);
        itemsByCategoryId.get(categoryId).push(item);
    }

    return safeCategories.map((cat) => {
        const categoryId = String(cat?.categoryid ?? cat?.categoryId ?? "");
        const categoryName = String(cat?.categoryname ?? cat?.categoryName ?? cat?.name ?? "");
        return {
            categoryId,
            categoryName,
            items: itemsByCategoryId.get(categoryId) || [],
        };
    });
};

export const mapPetpoojaItem = (petpoojaItem, categoryNameById) => {
    const categoryId = toString(petpoojaItem?.item_categoryid);
    const categoryName = categoryNameById?.[categoryId] || "";

    const attributeId = toString(petpoojaItem?.item_attributeid);
    const isVeg = attributeId === ATTRIBUTE_VEG || (!attributeId && true);
    const isNonVeg = attributeId === ATTRIBUTE_NON_VEG;
    const isEgg = attributeId === ATTRIBUTE_EGG;

    const variants = mapVariants(petpoojaItem?.variation);
    const addons = mapAddons(petpoojaItem?.addon);
    const allowVariation = toString(petpoojaItem?.itemallowvariation) === "1";
    const allowAddon = toString(petpoojaItem?.itemallowaddon) === "1";
    const isCustomisable = (allowVariation && variants.length > 0) || (allowAddon && addons.length > 0) || variants.length > 0 || addons.length > 0;

    const isCombo = toString(petpoojaItem?.is_combo) === "1";
    const isRecommended = toString(petpoojaItem?.is_recommend) === "1";

    // Petpooja bestseller/favorite flags (string "1" usually).
    const isBestseller =
        toString(petpoojaItem?.item_favorite) === "1" ||
        toString(petpoojaItem?.bestseller) === "1";

    const customImage = toString(petpoojaItem?.custom_image);
    const localImage = toString(petpoojaItem?.local_image);
    const remoteImage = toString(petpoojaItem?.item_image_url);
    const preferredImage = customImage || remoteImage || localImage || FALLBACK_IMAGE;

    // Keep your UI working by providing the fields used across components.
    return {
        id: toString(petpoojaItem?.itemid),
        name: toString(petpoojaItem?.itemname),
        description: toString(petpoojaItem?.itemdescription),
        price: normalizePrice(petpoojaItem?.price),
        image: normalizeImage(preferredImage),
        custom_image: customImage || null,
        local_image: localImage || null,
        item_image_url: remoteImage || null,
        categoryId,

        isVeg,
        isNonVeg,
        isEgg,
        stock: mapStock(petpoojaItem?.in_stock),
        isCombo,
        isRecommended,
        cuisine: extractCuisineNames(petpoojaItem?.cuisine),
        tags: extractTags(petpoojaItem?.item_tags),
        variants,
        addons,
        isCustomisable,

        // Compatibility fields used by existing screens/modals/filters.
        category: categoryName,
        originalPrice: null,
        isNew: false,
        isBestseller,
    };
};

const buildCategoryNameById = (categories) => {
    const map = {};
    for (const cat of safeArray(categories)) {
        const id = String(cat?.categoryid ?? "");
        const name = String(cat?.categoryname ?? "");
        if (id) map[id] = name;
    }
    return map;
};

const normalizeCategories = (categories, items) => {
    const safeCategories = safeArray(categories);
    const safeItems = safeArray(items);

    const byId = new Map();
    for (const cat of safeCategories) {
        const id = String(cat?.categoryid ?? "");
        if (!id) continue;
        byId.set(id, {
            id,
            name: String(cat?.categoryname ?? ""),
            categoryid: id,
            categoryname: String(cat?.categoryname ?? ""),
        });
    }

    // Ensure categories exist for any category IDs present in items.
    for (const item of safeItems) {
        const id = String(item?.item_categoryid ?? "");
        if (!id || byId.has(id)) continue;
        byId.set(id, {
            id,
            name: "Uncategorized",
            categoryid: id,
            categoryname: "Uncategorized",
        });
    }

    return Array.from(byId.values());
};

export const selectBestsellers = (items, { max = 10, priceUnder = 150 } = {}) => {
    const safeItems = safeArray(items);

    const byIdCount = new Map();
    for (const it of safeItems) {
        const id = it?.id;
        if (!id) continue;
        byIdCount.set(id, (byIdCount.get(id) || 0) + 1);
    }
    const frequentIds = Array.from(byIdCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, max)
        .map(([id]) => id);
    const frequentSet = new Set(frequentIds);

    const chosen = safeItems.filter((i) => (i?.price ?? 0) < priceUnder || i?.isRecommended || frequentSet.has(i?.id));
    if (chosen.length > 0) return chosen.slice(0, max);

    return safeItems.slice(0, max);
};

export const fetchPetpoojaMenu = async ({ signal } = {}) => {
    const res = await fetch(MENU_URL, { method: "GET", signal });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Menu API failed (${res.status})${text ? `: ${text}` : ""}`);
    }

    const data = await res.json();
    return {
        categories: safeArray(data?.categories),
        items: safeArray(data?.items),
        taxes: safeArray(data?.taxes),
    };
};

export const getProcessedMenu = async ({ signal } = {}) => {
    const raw = await fetchPetpoojaMenu({ signal });

    const normalizedCategories = normalizeCategories(raw.categories, raw.items);
    const categoryNameById = buildCategoryNameById(normalizedCategories);

    const mappedItems = safeArray(raw.items)
        .map((it) => mapPetpoojaItem(it, categoryNameById))
        // Drop items that don't have a usable id/name.
        .filter((it) => it.id && it.name);

    // If a category name couldn't be resolved, keep it stable.
    for (const item of mappedItems) {
        if (!item.category) item.category = "Uncategorized";
    }

    // Prefer Petpooja's own favorite/bestseller flags when present.
    // If none are flagged, fall back to a simple heuristic selector.
    const flaggedBestsellers = mappedItems.filter((i) => i.isBestseller);
    const maxBestsellers = 10;

    let chosenBestsellers = flaggedBestsellers;
    if (chosenBestsellers.length < 1) {
        chosenBestsellers = selectBestsellers(mappedItems, { max: maxBestsellers, priceUnder: 150 });
    } else if (chosenBestsellers.length < maxBestsellers) {
        const already = new Set(chosenBestsellers.map((b) => b.id));
        const filler = selectBestsellers(
            mappedItems.filter((i) => !already.has(i.id)),
            { max: maxBestsellers, priceUnder: 150 }
        );
        chosenBestsellers = [...chosenBestsellers, ...filler].slice(0, maxBestsellers);
    } else {
        chosenBestsellers = chosenBestsellers.slice(0, maxBestsellers);
    }

    const bestsellerIds = new Set(chosenBestsellers.map((b) => b.id));
    const itemsWithFlags = mappedItems.map((it) => ({
        ...it,
        // Keep Petpooja flag OR chosen list; never drop variant items just because base price is 0.
        isBestseller: Boolean(it.isBestseller) || bestsellerIds.has(it.id),
    }));

    // Keep a stable, capped list for the UI strip.
    const bestsellersForStrip = chosenBestsellers
        .map((b) => itemsWithFlags.find((it) => it.id === b.id))
        .filter(Boolean);

    // Remove categories that have zero items after mapping.
    const usedCategoryIds = new Set(itemsWithFlags.map((i) => i.categoryId).filter(Boolean));
    const finalCategories = normalizedCategories.filter((c) => usedCategoryIds.has(toString(c?.categoryid)));

    const grouped = groupMenuByCategory(finalCategories, itemsWithFlags);

    return {
        raw,
        categories: finalCategories.map((c) => ({
            id: toString(c.categoryid),
            name: toString(c.categoryname),
        })),
        items: itemsWithFlags,
        grouped,
        bestsellers: bestsellersForStrip,
    };
};
