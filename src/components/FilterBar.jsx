import OrderTypeDropdown from "@/components/OrderTypeDropdown";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { Clock, Info, MapPin, Search, SlidersHorizontal } from "lucide-react";
import OffersStrip from "./OffersStrip";

import { useState } from "react";

const FilterBar = ({
  activeFilter = "all",
  onFilterChange,
  searchQuery: controlledSearch,
  onSearchChange,
  availableTags = [],
  selectedTags = [],
  priceSort = "none",
  typeFilters = { veg: false, nonveg: false, egg: false, new: false },
  onAdvancedFiltersApply,
}) => {
  const { storeOpen } = useStoreStatus();
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftPriceSort, setDraftPriceSort] = useState(priceSort);
  const [draftTags, setDraftTags] = useState(selectedTags);
  const [draftTypes, setDraftTypes] = useState(typeFilters);

  const filters = [
    {
      key: "all",
      label: "Filters",
      icon: <SlidersHorizontal className="w-[12px] h-[12px]" />,
    },
    // {
    //   key: "veg",
    //   label: "Veg",
    //   icon: (
    //     <span className="w-[12px] h-[12px] border border-[#2e7d32] rounded-sm flex items-center justify-center">
    //       <span className="w-[5px] h-[5px] rounded-sm bg-[#2e7d32]" />
    //     </span>
    //   ),
    // },
    // {
    //   key: "new",
    //   label: "What's New!",
    //   icon: <Sparkles className="w-[12px] h-[12px]" />,
    // },
  ];

  const openFilters = () => {
    setDraftPriceSort(priceSort || "none");
    setDraftTags(Array.isArray(selectedTags) ? selectedTags : []);
    setDraftTypes(
      typeFilters && typeof typeFilters === "object"
        ? typeFilters
        : { veg: false, nonveg: false, egg: false, new: false },
    );
    setFiltersOpen(true);
  };

  const toggleTag = (tag) => {
    setDraftTags((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (safePrev.includes(tag)) return safePrev.filter((t) => t !== tag);
      return [...safePrev, tag];
    });
  };

  const applyAdvancedFilters = () => {
    if (onAdvancedFiltersApply) {
      onAdvancedFiltersApply({
        priceSort: draftPriceSort,
        tags: draftTags,
        types: draftTypes,
      });
    }
    setFiltersOpen(false);
  };

  const toggleType = (key) => {
    setDraftTypes((prev) => {
      const safePrev =
        prev && typeof prev === "object"
          ? prev
          : { veg: false, nonveg: false, egg: false, new: false };
      return {
        ...safePrev,
        [key]: !safePrev[key],
      };
    });
  };

  // Use controlled or local state for search
  const searchValue =
    controlledSearch !== undefined ? controlledSearch : search;
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  // Theme colors (only used inside the modal)
  const PRIMARY = "#e85d04";
  const PRIMARY_BG = "#fff4ee";

  // Active filter count for badge
  const activeCount =
    (draftPriceSort !== "none" ? 1 : 0) +
    (Array.isArray(draftTags) ? draftTags.length : 0) +
    Object.values(draftTypes || {}).filter(Boolean).length;

  return (
    <div
      className="w-[calc(100%+32px)] -mx-4 md:w-full md:mx-0 md:rounded-[20px] md:border md:border-[#E6E6E6] px-[16px] md:px-[22px] pt-0 pb-0 md:pt-[18px] md:pb-[18px]"
      style={{ fontFamily: "'Poppins', sans-serif", background: "#F7F7F7" }}
    >
      {/* ===== TOP SECTION ===== */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-[24px]">
        {/* LEFT + PICKUP ROW (Mobile Adjusted) */}
        <div className="flex justify-between items-start md:items-center w-full md:w-auto md:flex-shrink-0">
          {/* Restaurant Info - hidden on mobile, visible on sm+ */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-[6px] flex-wrap">
              <span
                className="text-[18px] md:text-[19px] text-[#222222]"
                style={{
                  fontFamily:
                    'Inter, "Proxima Nova", "Poppins", Arial, sans-serif',
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                }}
              >
                Just Eat Bharat
              </span>
              <span className="w-[15px] h-[15px] rounded-sm border border-[#DADADA] flex items-center justify-center text-[#9A9A9A]">
                <Info className="w-[9px] h-[9px]" />
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  border: `1px solid ${storeOpen ? "#1BA672" : "#dc2626"}`,
                  borderRadius: "5px",
                  fontWeight: 500,
                  color: storeOpen ? "#1BA672" : "#dc2626",
                  display: "inline-block",
                  marginLeft: "4px",
                  width: "fit-content",
                }}
              >
                {storeOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>

            <div className="flex items-center gap-[14px] mt-[4px]">
              <span
                className="flex items-center gap-[4px]"
                style={{
                  fontSize: "13px",
                  color: "#686B78",
                  fontWeight: 400,
                }}
              >
                <Clock className="w-[12px] h-[12px]" />
                30 Minutes
              </span>
              <span
                className="flex items-center gap-[4px]"
                style={{
                  fontSize: "13px",
                  color: "#686B78",
                  fontWeight: 400,
                }}
              >
                <MapPin className="w-[12px] h-[12px]" />
                Zirakpur
              </span>
            </div>
          </div>

          {/* Pickup (Desktop only - top-right) - removed to avoid duplicate on desktop */}
        </div>

        {/* Divider: horizontal on mobile, vertical on desktop */}
        <div className="w-full h-[1px] md:w-[1px] md:h-[48px] bg-[#E6E6E6] flex-shrink-0" />

        {/* OFFERS SECTION */}
        <div className="md:flex-1 md:min-w-0 w-full">
          <OffersStrip />
        </div>

        {/* Removed old Pick Up/Change button from top card area */}
      </div>

      {/* ===== FILTER ROW ===== */}
      <div className="mt-[16px] mb-3 md:mb-0 flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
        {/* FILTER BUTTONS */}
        {filters.map((f) => (
          <button
            key={f.key}
            className="flex items-center gap-[6px] rounded-[12px]  whitespace-nowrap flex-shrink-0"
            style={{
              border: "1px solid #E9E9EB",
              background:
                activeFilter === f.key && f.key !== "all" ? "#F3F0ED" : "#fff",
              padding: "8px 14px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#444",
            }}
            onClick={() => {
              if (f.key === "all") {
                openFilters();
                return;
              }
              if (!onFilterChange) return;
              onFilterChange(activeFilter === f.key ? "all" : f.key);
            }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}

        {/* SEARCH - hidden on mobile */}
        <div className="relative flex-shrink-0 w-[270px] ml-auto hidden md:block">
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-[#8C8C8C]" />
          <input
            type="text"
            placeholder="Search Menu"
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full placeholder-[#8C8C8C] focus:outline-none"
            style={{
              border: "1px solid #E9E9EB",
              borderRadius: "12px",
              padding: "10px 14px 10px 36px",
              fontSize: "14px",
              background: "#FFFFFF",
              color: "#222",
            }}
          />
        </div>

        {/* ORDER TYPE DROPDOWN */}
        <OrderTypeDropdown className="ml-2" />
        {/* END ORDER TYPE DROPDOWN */}
        {/* Removed old Pick Up/Change button UI */}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FILTERS MODAL — only this block redesigned, nothing else
      ═══════════════════════════════════════════════════════════ */}
      {filtersOpen && (
        <>
          <style>{`
            @keyframes fb-pop-in {
              from { transform: scale(0.94); opacity: 0; }
              to   { transform: scale(1);    opacity: 1; }
            }
            @keyframes fb-fade-in {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            .fb-backdrop { animation: fb-fade-in 0.18s ease both; }
            .fb-sheet    { animation: fb-pop-in  0.22s cubic-bezier(.32,1.1,.48,1) both; }

            .fb-type-pill {
              display: flex; align-items: center; gap: 8px;
              padding: 10px 14px; border-radius: 13px;
              border: 1.5px solid #e5e7eb;
              background: #fff; cursor: pointer;
              font-size: 13px; font-weight: 600; color: #374151;
              font-family: 'Poppins', sans-serif;
              transition: border-color 0.14s, background 0.14s, color 0.14s;
            }
            .fb-type-pill.fb-on {
              border-color: ${PRIMARY};
              background: ${PRIMARY_BG};
              color: ${PRIMARY};
            }

            .fb-sort-row {
              display: flex; align-items: center; justify-content: space-between;
              padding: 12px 14px; border-radius: 13px;
              border: 1.5px solid #e5e7eb;
              background: #fff; cursor: pointer;
              font-size: 13px; font-weight: 600; color: #374151;
              font-family: 'Poppins', sans-serif;
              transition: border-color 0.14s, background 0.14s, color 0.14s;
            }
            .fb-sort-row.fb-on {
              border-color: ${PRIMARY};
              background: ${PRIMARY_BG};
              color: ${PRIMARY};
            }
            .fb-radio-circle {
              width: 18px; height: 18px; border-radius: 50%;
              border: 2px solid #d1d5db; flex-shrink: 0;
              display: flex; align-items: center; justify-content: center;
              transition: border-color 0.14s;
            }
            .fb-sort-row.fb-on .fb-radio-circle { border-color: ${PRIMARY}; }
            .fb-radio-dot {
              width: 9px; height: 9px; border-radius: 50%;
              background: ${PRIMARY}; opacity: 0;
              transition: opacity 0.14s;
            }
            .fb-sort-row.fb-on .fb-radio-dot { opacity: 1; }

            .fb-tag-pill {
              padding: 6px 14px; border-radius: 999px;
              border: 1.5px solid #e5e7eb;
              background: #fff; cursor: pointer;
              font-size: 12px; font-weight: 600; color: #374151;
              font-family: 'Poppins', sans-serif;
              white-space: nowrap;
              transition: border-color 0.14s, background 0.14s, color 0.14s;
            }
            .fb-tag-pill.fb-on {
              border-color: ${PRIMARY};
              background: ${PRIMARY_BG};
              color: ${PRIMARY};
            }

            .fb-label {
              font-size: 11px; font-weight: 800;
              color: #9ca3af; letter-spacing: 0.8px;
              text-transform: uppercase;
              display: block; margin-bottom: 11px;
              font-family: 'Poppins', sans-serif;
            }

            .fb-clear-btn {
              flex: 1; height: 50px; border-radius: 14px;
              border: 1.5px solid #e5e7eb;
              background: #fff; color: #374151;
              font-size: 14px; font-weight: 700; cursor: pointer;
              font-family: 'Poppins', sans-serif;
              transition: background 0.14s;
            }
            .fb-clear-btn:hover { background: #f9fafb; }

            .fb-apply-btn {
              flex: 2; height: 50px; border-radius: 14px;
              border: none;
              background: ${PRIMARY}; color: #fff;
              font-size: 14px; font-weight: 800; cursor: pointer;
              font-family: 'Poppins', sans-serif;
              box-shadow: 0 4px 18px ${PRIMARY}44;
              display: flex; align-items: center; justify-content: center; gap: 8px;
              transition: opacity 0.14s;
            }
            .fb-apply-btn:hover { opacity: 0.92; }
            .fb-apply-badge {
              background: rgba(255,255,255,0.25);
              border-radius: 999px; font-size: 12px;
              font-weight: 800; padding: 1px 8px;
            }
          `}</style>

          {/* ── Backdrop — flex centering on ALL screens ── */}
          <div
            className="fb-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(0,0,0,0.48)",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 16px",
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setFiltersOpen(false);
            }}
            onTouchStart={(e) => {
              if (e.target === e.currentTarget) setFiltersOpen(false);
            }}
          >
            {/* ── Centered popup card ── */}
            <div
              className="fb-sheet"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                background: "#fff",
                borderRadius: 22,
                maxHeight: "88dvh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 8px 60px rgba(0,0,0,0.28)",
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px 13px",
                  borderBottom: "1px solid #f3f4f6",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span
                    style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}
                  >
                    Filters
                  </span>
                  {activeCount > 0 && (
                    <span
                      style={{
                        background: PRIMARY,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 800,
                        borderRadius: 999,
                        padding: "2px 8px",
                      }}
                    >
                      {activeCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFiltersOpen(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1.5px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                  }}
                  aria-label="Close"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div
                style={{ overflowY: "auto", padding: "20px 20px 6px", flex: 1 }}
              >
                {/* ── FOOD TYPE ── */}
                <span className="fb-label">Food Type</span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 9,
                    marginBottom: 26,
                  }}
                >
                  {[
                    { key: "veg", label: "Veg", dotColor: "#16a34a" },
                    { key: "nonveg", label: "Non-Veg", dotColor: PRIMARY },
                    { key: "egg", label: "Egg", dotColor: "#f59e0b" },
                    { key: "new", label: "What's New", dotColor: null },
                  ].map(({ key, label, dotColor }) => {
                    const on = Boolean(draftTypes?.[key]);
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`fb-type-pill${on ? " fb-on" : ""}`}
                        onClick={() => toggleType(key)}
                      >
                        {dotColor ? (
                          <span
                            style={{
                              width: 15,
                              height: 15,
                              flexShrink: 0,
                              border: `2px solid ${on ? dotColor : "#d1d5db"}`,
                              borderRadius: 3,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "border-color 0.14s",
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: dotColor,
                                opacity: on ? 1 : 0.3,
                                transition: "opacity 0.14s",
                                display: "block",
                              }}
                            />
                          </span>
                        ) : (
                          <span style={{ fontSize: 14, lineHeight: 1 }}>
                            ✨
                          </span>
                        )}
                        {label}
                        {on && (
                          <span
                            style={{
                              marginLeft: "auto",
                              color: PRIMARY,
                              display: "flex",
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── PRICE SORT ── */}
                <span className="fb-label">Sort by Price</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    marginBottom: 26,
                  }}
                >
                  {[
                    { value: "low-high", label: "Low to High", icon: "↑" },
                    { value: "high-low", label: "High to Low", icon: "↓" },
                    { value: "none", label: "No Sort", icon: "–" },
                  ].map(({ value, label, icon }) => {
                    const on = draftPriceSort === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`fb-sort-row${on ? " fb-on" : ""}`}
                        onClick={() => setDraftPriceSort(value)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 11,
                          }}
                        >
                          <span
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 9,
                              background: on ? PRIMARY_BG : "#f9fafb",
                              border: `1.5px solid ${on ? PRIMARY + "55" : "#e5e7eb"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 15,
                              fontWeight: 700,
                              flexShrink: 0,
                              color: on ? PRIMARY : "#6b7280",
                              transition:
                                "background 0.14s, border-color 0.14s, color 0.14s",
                            }}
                          >
                            {icon}
                          </span>
                          {label}
                        </div>
                        <div className="fb-radio-circle">
                          <span className="fb-radio-dot" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ── TAGS ── */}
                <span className="fb-label">Tags</span>
                {Array.isArray(availableTags) && availableTags.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 24,
                    }}
                  >
                    {availableTags.map((tag) => {
                      const on =
                        Array.isArray(draftTags) && draftTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          className={`fb-tag-pill${on ? " fb-on" : ""}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}
                  >
                    No tags available
                  </p>
                )}
              </div>

              {/* ── Footer ── */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 20px",
                  paddingBottom:
                    "calc(12px + env(safe-area-inset-bottom, 0px))",
                  borderTop: "1px solid #f3f4f6",
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  className="fb-clear-btn"
                  onClick={() => {
                    setDraftPriceSort("none");
                    setDraftTags([]);
                    setDraftTypes({
                      veg: false,
                      nonveg: false,
                      egg: false,
                      new: false,
                    });
                  }}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  className="fb-apply-btn"
                  onClick={applyAdvancedFilters}
                >
                  Apply Filters
                  {activeCount > 0 && (
                    <span className="fb-apply-badge">{activeCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterBar;
