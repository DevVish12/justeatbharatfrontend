import AddBar from "@/components/AddBar";
import BestsellerStrip from "@/components/BestsellerStrip";
import FilterBar from "@/components/FilterBar";
import FloatingButtonStack from "@/components/FloatingButtonStack";
import FloatingMenuBar from "@/components/FloatingMenuBar";
import Footer from "@/components/Footer";
import GlobalLoader from "@/components/GlobalLoader";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MenuItemCard from "@/components/MenuItemCard";
import MenuNavigationSidebar from "@/components/MenuNavigationSidebar";
import MenuSheet from "@/components/MenuSheet";
import ProductModal from "@/components/ProductModal";
import Sidebar from "@/components/Sidebar";
import { useCart } from "@/context/CartContext";
import { getProcessedMenu } from "@/services/menuService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const getDisplayPrice = (item) => {
  if (item?.variants && item.variants.length > 0) {
    const prices = item.variants
      .map((v) => Number(v?.price))
      .filter((n) => Number.isFinite(n));
    if (prices.length > 0) return Math.min(...prices);
  }
  const base = Number(item?.price);
  return Number.isFinite(base) ? base : 0;
};

const Index = () => {
  // Show button only when scrolled down
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceSort, setPriceSort] = useState("none");
  const [typeFilters, setTypeFilters] = useState({
    veg: false,
    nonveg: false,
    egg: false,
    new: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleItemClick = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [bestsellerItems, setBestsellerItems] = useState([]);

  const sectionRefs = useRef({});
  const itemRefs = useRef({});
  const searchRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setMenuLoading(true);
    setMenuError(null);

    getProcessedMenu({ signal: controller.signal })
      .then((data) => {
        setMenuCategories(
          Array.isArray(data?.categories) ? data.categories : [],
        );
        setMenuItems(Array.isArray(data?.items) ? data.items : []);
        setBestsellerItems(
          Array.isArray(data?.bestsellers) ? data.bestsellers : [],
        );

        if (
          import.meta.env.DEV &&
          String(import.meta.env.VITE_DEBUG_BESTSELLERS || "").toLowerCase() ===
            "true"
        ) {
          const menu = Array.isArray(data?.items) ? data.items : [];
          // eslint-disable-next-line no-console
          console.log("Menu items:", menu);
          // eslint-disable-next-line no-console
          console.log(
            "Bestseller items:",
            menu.filter((i) => i?.isBestseller),
          );
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setMenuCategories([]);
        setMenuItems([]);
        setBestsellerItems([]);
        setMenuError(err?.message || "Failed to load menu");
      })
      .finally(() => {
        setMenuLoading(false);
      });

    return () => controller.abort();
  }, []);

  const availableTags = useMemo(() => {
    const set = new Set();
    for (const item of Array.isArray(menuItems) ? menuItems : []) {
      const tags = Array.isArray(item?.tags) ? item.tags : [];
      for (const t of tags) {
        const tag = String(t || "").trim();
        if (tag) set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [menuItems]);

  const filteredByCategory = useMemo(() => {
    const grouped = {};
    const selectedTagSet = new Set(
      (Array.isArray(selectedTags) ? selectedTags : []).filter(Boolean),
    );

    const hasAdvancedTypes =
      Boolean(typeFilters?.veg) ||
      Boolean(typeFilters?.nonveg) ||
      Boolean(typeFilters?.egg) ||
      Boolean(typeFilters?.new);

    menuCategories.forEach((cat) => {
      let items = menuItems.filter((i) => i.category === cat.name);

      if (hasAdvancedTypes) {
        items = items.filter((i) => {
          const matchVeg = Boolean(typeFilters?.veg) && Boolean(i.isVeg);
          const matchNonVeg =
            Boolean(typeFilters?.nonveg) &&
            (Boolean(i.isNonVeg) || (!i.isVeg && !i.isEgg));
          const matchEgg = Boolean(typeFilters?.egg) && Boolean(i.isEgg);
          const matchNew = Boolean(typeFilters?.new) && Boolean(i.isNew);
          return matchVeg || matchNonVeg || matchEgg || matchNew;
        });
      } else {
        if (activeFilter === "veg") items = items.filter((i) => i.isVeg);
        if (activeFilter === "nonveg") items = items.filter((i) => !i.isVeg);
        if (activeFilter === "new") items = items.filter((i) => i.isNew);
      }

      if (searchQuery)
        items = items.filter((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      if (selectedTagSet.size > 0) {
        items = items.filter((i) => {
          const tags = Array.isArray(i?.tags) ? i.tags : [];
          return tags.some((t) => selectedTagSet.has(String(t).trim()));
        });
      }

      if (priceSort === "low-high") {
        items = [...items].sort(
          (a, b) => getDisplayPrice(a) - getDisplayPrice(b),
        );
      }
      if (priceSort === "high-low") {
        items = [...items].sort(
          (a, b) => getDisplayPrice(b) - getDisplayPrice(a),
        );
      }

      if (items.length > 0) grouped[cat.name] = items;
    });
    return grouped;
  }, [
    activeFilter,
    searchQuery,
    menuCategories,
    menuItems,
    selectedTags,
    priceSort,
    typeFilters,
  ]);

  // Ensure scroll-tracking starts from the first category.
  useEffect(() => {
    const names = Object.keys(filteredByCategory);
    if (!names.length) return;
    if (!activeCategory || !names.includes(activeCategory)) {
      setActiveCategory(names[0]);
    }
  }, [filteredByCategory, activeCategory]);

  // --- SCROLLSPY LOGIC ---
  useEffect(() => {
    const sectionNames = Object.keys(filteredByCategory);
    if (!sectionNames.length) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        // Anchors are tiny elements at the top of each section.
        // When one enters the "tracking zone", we mark it active.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const topSection = visible[0];
          if (
            topSection &&
            topSection.target &&
            topSection.target.dataset.cat
          ) {
            setActiveCategory(topSection.target.dataset.cat);
          }
        }
      },
      {
        root: null,
        // Track a bit below the sticky header; keep a shallow zone.
        rootMargin: "-110px 0px -75% 0px",
        threshold: 0,
      },
    );
    sectionNames.forEach((cat) => {
      const el = sectionRefs.current[cat];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [filteredByCategory]);
  // --- END SCROLLSPY ---

  const filteredBestsellers = useMemo(() => {
    let items = Array.isArray(bestsellerItems) ? bestsellerItems : [];

    const hasAdvancedTypes =
      Boolean(typeFilters?.veg) ||
      Boolean(typeFilters?.nonveg) ||
      Boolean(typeFilters?.egg) ||
      Boolean(typeFilters?.new);

    if (hasAdvancedTypes) {
      items = items.filter((i) => {
        const matchVeg = Boolean(typeFilters?.veg) && Boolean(i.isVeg);
        const matchNonVeg =
          Boolean(typeFilters?.nonveg) &&
          (Boolean(i.isNonVeg) || (!i.isVeg && !i.isEgg));
        const matchEgg = Boolean(typeFilters?.egg) && Boolean(i.isEgg);
        const matchNew = Boolean(typeFilters?.new) && Boolean(i.isNew);
        return matchVeg || matchNonVeg || matchEgg || matchNew;
      });
    } else {
      if (activeFilter === "veg") items = items.filter((i) => i.isVeg);
      if (activeFilter === "nonveg") items = items.filter((i) => !i.isVeg);
      if (activeFilter === "new") items = items.filter((i) => i.isNew);
    }

    if (searchQuery)
      items = items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const selectedTagSet = new Set(
      (Array.isArray(selectedTags) ? selectedTags : []).filter(Boolean),
    );
    if (selectedTagSet.size > 0) {
      items = items.filter((i) => {
        const tags = Array.isArray(i?.tags) ? i.tags : [];
        return tags.some((t) => selectedTagSet.has(String(t).trim()));
      });
    }

    if (priceSort === "low-high") {
      items = [...items].sort(
        (a, b) => getDisplayPrice(a) - getDisplayPrice(b),
      );
    }
    if (priceSort === "high-low") {
      items = [...items].sort(
        (a, b) => getDisplayPrice(b) - getDisplayPrice(a),
      );
    }

    return items.slice(0, 6);
  }, [
    bestsellerItems,
    activeFilter,
    searchQuery,
    selectedTags,
    priceSort,
    typeFilters,
  ]);

  const floatingMenuData = useMemo(() => {
    return Object.entries(filteredByCategory).map(([name, items]) => ({
      name,
      count: items.length,
    }));
  }, [filteredByCategory]);

  const scrollToCategory = useCallback((name) => {
    setActiveCategory(name);
    const el = sectionRefs.current[name];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToItem = useCallback((itemId, categoryName) => {
    if (categoryName) setActiveCategory(categoryName);
    const el = itemRefs.current[itemId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleQuickAdd = useCallback(
    (item) => {
      addItem(item);
    },
    [addItem],
  );

  // Block initial render until menu data is ready.
  // This prevents the UI from showing "static" content first and then updating later.
  if (menuLoading) {
    return <GlobalLoader message="Loading menu…" />;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F7" }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="max-w-[1280px] mx-auto px-4 pt-2">
        <div className="flex gap-4 pt-4">
          <MenuNavigationSidebar
            activeCategory={activeCategory}
            onCategoryClick={scrollToCategory}
            filteredItems={filteredByCategory}
            onDishClick={(dish) => {
              if (!dish?.id) return;
              scrollToItem(dish.id, dish.categoryName);
            }}
          />

          <div className="flex-1 min-w-0">
            {/* Address bar above HeroBanner, only on mobile */}
            <AddBar />
            <HeroBanner />

            <div className="mt-2 md:mt-4 lg:mt-4">
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={(next) => {
                  setActiveFilter(next);
                  setTypeFilters({
                    veg: false,
                    nonveg: false,
                    egg: false,
                    new: false,
                  });
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                availableTags={availableTags}
                selectedTags={selectedTags}
                priceSort={priceSort}
                typeFilters={typeFilters}
                onAdvancedFiltersApply={({
                  priceSort: nextSort,
                  tags,
                  types,
                }) => {
                  setPriceSort(nextSort || "none");
                  setSelectedTags(Array.isArray(tags) ? tags : []);

                  const safeTypes =
                    types && typeof types === "object"
                      ? {
                          veg: Boolean(types.veg),
                          nonveg: Boolean(types.nonveg),
                          egg: Boolean(types.egg),
                          new: Boolean(types.new),
                        }
                      : { veg: false, nonveg: false, egg: false, new: false };

                  setTypeFilters(safeTypes);

                  const anyTypeSelected =
                    safeTypes.veg ||
                    safeTypes.nonveg ||
                    safeTypes.egg ||
                    safeTypes.new;
                  if (anyTypeSelected) {
                    setActiveFilter("all");
                  }
                }}
              />
            </div>

            {/* ✅ BestsellerStrip — solid white island, no Tailwind bg classes */}
            <div
              id="bestseller"
              className="mt-0 md:mt-4"
              style={{ background: "#ffffff" }}
            >
              <BestsellerStrip
                items={filteredBestsellers}
                onItemClick={handleItemClick}
                onQuickAdd={handleQuickAdd}
              />
            </div>

            <div className="space-y-8 pt-4">
              {Object.entries(filteredByCategory).map(([catName, items]) => (
                <section key={catName} className="scroll-mt-20">
                  <div
                    ref={(el) => {
                      sectionRefs.current[catName] = el;
                    }}
                    data-cat={catName}
                    className="h-px scroll-mt-20"
                  />
                  <h2 className="text-lg md:text-xl font-bold text-foreground mb-6 text-center">
                    {catName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        ref={(el) => {
                          if (el) itemRefs.current[item.id] = el;
                        }}
                      >
                        <MenuItemCard
                          item={item}
                          onItemClick={handleItemClick}
                          onQuickAdd={handleQuickAdd}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {menuError && !menuLoading && (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm font-medium">Menu unavailable</p>
                <p className="text-xs mt-1">{menuError}</p>
              </div>
            )}

            {!menuLoading &&
              !menuError &&
              Object.keys(filteredByCategory).length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-sm font-medium">No items found</p>
                  <p className="text-xs mt-1">
                    Try a different search or filter
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      <Footer />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuSheet
        isOpen={menuSheetOpen}
        onClose={() => setMenuSheetOpen(false)}
        onCategoryClick={scrollToCategory}
        filteredItems={filteredByCategory}
      />
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <FloatingMenuBar
        onSearchFocus={() => searchRef.current?.focus()}
        onMenuOpen={() => setMenuSheetOpen(true)}
        menuData={floatingMenuData}
        filteredItems={filteredByCategory}
        onCategoryClick={scrollToCategory}
        onDishClick={(dish) => {
          if (!dish?.id) return;
          scrollToItem(dish.id, dish.categoryName);
        }}
      />
      <FloatingButtonStack />
    </div>
  );
};

export default Index;
