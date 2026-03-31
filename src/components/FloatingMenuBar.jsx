import { Minus, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const FloatingMenuBar = ({
  onSearchFocus,
  menuData,
  filteredItems,
  onCategoryClick,
  onDishClick,
}) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (location.pathname === "/cart") return null;

  const menuList = useMemo(() => {
    if (filteredItems && typeof filteredItems === "object") {
      return Object.entries(filteredItems).map(([name, items]) => {
        const safeItems = Array.isArray(items) ? items : [];
        return {
          name,
          count: safeItems.length,
          submenu: safeItems
            .map((it) => ({
              id: it?.id,
              name: String(it?.name ?? "").trim(),
            }))
            .filter((d) => d.id && d.name),
        };
      });
    }

    if (Array.isArray(menuData) && menuData.length) {
      return menuData.map((it) => ({
        name: it?.name,
        count: it?.count ?? 0,
        submenu: Array.isArray(it?.submenu) ? it.submenu : [],
      }));
    }

    return [];
  }, [filteredItems, menuData]);

  const toggleExpand = (name) => {
    setExpandedCategory((curr) => (curr === name ? null : name));
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border shadow-lg lg:hidden">
        <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-2.5">
          <button
            onClick={onSearchFocus}
            className="flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search Menu</span>
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-xs font-bold tracking-wide hover:opacity-90 transition-opacity"
          >
            MENU
          </button>
        </div>
      </div>

      {/* Modal for menu list */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-end lg:hidden">
          <div className="w-full max-h-[80vh] bg-white rounded-t-2xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
            {menuList.map((item) => {
              const hasSubmenu =
                Array.isArray(item.submenu) && item.submenu.length;
              const isExpanded = expandedCategory === item.name;

              return (
                <div key={item.name}>
                  <div
                    className={`w-full px-4 mb-1 rounded-lg flex items-stretch justify-between ${
                      isExpanded
                        ? "bg-orange-500 text-white"
                        : "hover:bg-orange-100 text-gray-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof onCategoryClick === "function") {
                          onCategoryClick(item.name);
                          setMenuOpen(false);
                        } else {
                          toggleExpand(item.name);
                        }
                      }}
                      className="flex-1 h-10 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-medium">
                        ({item.count})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleExpand(item.name);
                      }}
                      className={`h-10 pl-3 pr-1 flex items-center ${hasSubmenu ? "opacity-100" : "opacity-60"}`}
                      aria-label={
                        isExpanded ? "Collapse category" : "Expand category"
                      }
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isExpanded
                            ? "bg-orange-700 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                        aria-hidden="true"
                      >
                        {isExpanded ? (
                          <Minus className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </span>
                    </button>
                  </div>

                  {isExpanded && hasSubmenu && (
                    <div className="pl-8 pb-2">
                      {item.submenu.map((sub) => {
                        const label = typeof sub === "string" ? sub : sub?.name;
                        const id = typeof sub === "string" ? null : sub?.id;
                        return (
                          <button
                            key={id || label}
                            type="button"
                            onClick={() => {
                              if (id && typeof onDishClick === "function") {
                                onDishClick({
                                  id,
                                  name: label,
                                  categoryName: item.name,
                                });
                                setMenuOpen(false);
                                return;
                              }
                              if (typeof onCategoryClick === "function") {
                                onCategoryClick(item.name);
                                setMenuOpen(false);
                              }
                            }}
                            className="w-full h-8 flex items-center text-left text-xs text-gray-500 hover:text-black"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingMenuBar;
