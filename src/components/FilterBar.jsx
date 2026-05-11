import { Search, SlidersHorizontal } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftPriceSort, setDraftPriceSort] = useState(priceSort);
  const [draftTags, setDraftTags] = useState(selectedTags);
  const [draftTypes, setDraftTypes] = useState(typeFilters);

  const filters = [
    {
      key: "all",
      label: "Filters",
      icon: <SlidersHorizontal className="w-[14px] h-[14px]" />,
    },
  ];

  const searchValue =
    controlledSearch !== undefined ? controlledSearch : search;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

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
      return safePrev.includes(tag)
        ? safePrev.filter((t) => t !== tag)
        : [...safePrev, tag];
    });
  };

  const toggleType = (key) => {
    setDraftTypes((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const PRIMARY = "#E8590C";
  const PRIMARY_LIGHT = "#FFF4EE";

  return (
    <div
      className="w-full py-1.5 md:py-3 px-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-3">
        {/* Filter Button */}
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={openFilters}
            className="flex items-center gap-[7px] whitespace-nowrap transition-all"
            style={{
              border: "1.5px solid #E9E9EB",
              background: "#fff",
              padding: "9px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#333",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <SlidersHorizontal
              className="w-[14px] h-[14px]"
              style={{ color: PRIMARY }}
            />
            {f.label}
          </button>
        ))}

        {/* Search Bar — desktop only */}
        <div className="relative hidden md:block flex-1 max-w-[320px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px]"
            style={{ color: "#ADADAD" }}
          />
          <input
            type="text"
            placeholder="Search Menu"
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full focus:outline-none transition-all"
            style={{
              border: "1.5px solid #E9E9EB",
              borderRadius: "10px",
              padding: "9px 14px 9px 40px",
              fontSize: "13px",
              background: "#fff",
              color: "#222",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
            onBlur={(e) => (e.target.style.borderColor = "#E9E9EB")}
          />
        </div>
      </div>

      {/* ── FILTER MODAL ── */}
      {filtersOpen && (
        <>
          <style>{`
            .fb-backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 16px;
              z-index: 999;
            }
            .fb-sheet {
              width: 100%;
              max-width: 420px;
              background: #fff;
              border-radius: 20px;
              overflow: hidden;
              max-height: 88vh;
              display: flex;
              flex-direction: column;
              box-shadow: 0 20px 60px rgba(0,0,0,0.18);
            }
            .fb-label {
              font-size: 10px;
              font-weight: 700;
              color: #ADADAD;
              letter-spacing: 1.1px;
              text-transform: uppercase;
              margin-bottom: 10px;
              display: block;
            }
            .fb-type-pill {
              border: 1.5px solid #E9E9EB;
              background: #fff;
              border-radius: 10px;
              padding: 10px 14px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              color: #444;
              transition: all 0.15s;
            }
            .fb-tag-pill {
              border: 1.5px solid #E9E9EB;
              background: #fff;
              border-radius: 20px;
              padding: 8px 14px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              color: #444;
              transition: all 0.15s;
            }
            .fb-on {
              border-color: ${PRIMARY};
              background: ${PRIMARY_LIGHT};
              color: ${PRIMARY};
            }
            .fb-sort-row {
              border: 1.5px solid #E9E9EB;
              border-radius: 10px;
              padding: 12px 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              font-size: 13px;
              font-weight: 600;
              color: #333;
              transition: all 0.15s;
            }
            .fb-sort-row.fb-on {
              border-color: ${PRIMARY};
              background: ${PRIMARY_LIGHT};
              color: ${PRIMARY};
            }
            .fb-clear-btn {
              flex: 1;
              height: 46px;
              border-radius: 10px;
              border: 1.5px solid #E9E9EB;
              background: #fff;
              cursor: pointer;
              font-weight: 600;
              font-size: 13px;
              color: #444;
              transition: background 0.15s;
            }
            .fb-clear-btn:hover { background: #f9f9f9; }
            .fb-apply-btn {
              flex: 2;
              height: 46px;
              border-radius: 10px;
              border: none;
              background: ${PRIMARY};
              color: #fff;
              cursor: pointer;
              font-weight: 700;
              font-size: 14px;
              transition: opacity 0.15s;
            }
            .fb-apply-btn:hover { opacity: 0.9; }
          `}</style>

          <div
            className="fb-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setFiltersOpen(false);
            }}
          >
            <div className="fb-sheet">
              {/* Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  Filters
                </h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1.5px solid #E9E9EB",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                {/* Food Type */}
                <span className="fb-label">Food Type</span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    { key: "veg", label: "🟢 Veg" },
                    { key: "nonveg", label: "🔴 Non Veg" },
                    { key: "egg", label: "🟡 Egg" },
                    { key: "new", label: "✨ What's New" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => toggleType(item.key)}
                      className={`fb-type-pill ${draftTypes[item.key] ? "fb-on" : ""}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Sort By Price */}
                <span className="fb-label">Sort By Price</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    { value: "low-high", label: "Low to High" },
                    { value: "high-low", label: "High to Low" },
                    { value: "none", label: "No Sort" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setDraftPriceSort(item.value)}
                      className={`fb-sort-row ${draftPriceSort === item.value ? "fb-on" : ""}`}
                    >
                      {item.label}
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          display: "inline-block",
                          background:
                            draftPriceSort === item.value ? PRIMARY : "#D1D5DB",
                          flexShrink: 0,
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Tags */}
                <span className="fb-label">Tags</span>
                {availableTags.length > 0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`fb-tag-pill ${draftTags.includes(tag) ? "fb-on" : ""}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "13px", color: "#ADADAD" }}>
                    No tags available
                  </p>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "14px 20px",
                  borderTop: "1px solid #F3F4F6",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
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
                <button className="fb-apply-btn" onClick={applyAdvancedFilters}>
                  Apply Filters
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
