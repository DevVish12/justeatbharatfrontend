import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const MenuSidebar = ({
  filteredItems,
  activeCategory,
  onCategoryClick,
  onDishClick,
}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const menu = useMemo(() => {
    if (!filteredItems) return [];
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
  }, [filteredItems]);

  // Add missing toggleMenu function
  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // Auto-expand the active category only while scrolling.
  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      if (!hasInteracted && window.scrollY > 0) setHasInteracted(true);
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isScrolling) return;
    if (!activeCategory) return;
    setOpenMenu(activeCategory);
  }, [isScrolling, activeCategory]);

  return (
    <div className="hidden lg:block w-[280px] flex-shrink-0">
      <div className="sticky top-[90px] h-[calc(100vh-100px)] bg-white border border-[#e5e5e5] rounded-[18px]">
        <div className="px-[16px] pt-[16px] pb-[8px]">
          <h3 className="text-[18px] font-semibold text-[#2b2b2b]">Menu</h3>
        </div>
        <div
          className="overflow-y-auto sidebar-scroll"
          style={{ maxHeight: "calc(100vh - 148px)" }}
        >
          {menu.map((item) => {
            const isExpanded = openMenu === item.name;
            const isActive = hasInteracted && activeCategory === item.name;
            const hasSubmenu =
              Array.isArray(item.submenu) && item.submenu.length;
            return (
              <div key={item.name}>
                <div
                  className={`w-full h-[36px] px-[16px] flex items-center justify-between text-left transition ${
                    isActive ? "bg-[#FDBD90] text-white" : "hover:bg-[#f7f7f7]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setHasInteracted(true);
                      setOpenMenu(item.name);
                      if (typeof onCategoryClick === "function")
                        onCategoryClick(item.name);
                    }}
                    className="flex-1 h-full flex items-center text-left"
                  >
                    <span
                      className={`text-[13px] ${isActive ? "text-white font-light" : "text-[#333] font-light"}`}
                    >
                      {item.name}
                    </span>
                  </button>

                  <div className="flex items-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.name)}
                      className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-white text-[#F97415]"
                          : "bg-[#F97415] text-white"
                      } ${hasSubmenu ? "opacity-100" : "opacity-60"}`}
                      aria-label={
                        isExpanded ? "Collapse category" : "Expand category"
                      }
                      disabled={!hasSubmenu}
                    >
                      {isExpanded ? (
                        <Minus className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </button>
                    <span
                      className={`text-[13px] ${isActive ? "text-white" : "text-[#666]"}`}
                    >
                      ({item.count})
                    </span>
                  </div>
                </div>

                {hasSubmenu && isExpanded && (
                  <div className="bg-[#f6f6f6] py-[4px]">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setHasInteracted(true);
                          if (typeof onDishClick === "function") {
                            onDishClick({
                              id: sub.id,
                              name: sub.name,
                              categoryName: item.name,
                            });
                          } else if (typeof onCategoryClick === "function") {
                            onCategoryClick(item.name);
                          }
                        }}
                        className="w-full pl-[34px] h-[30px] flex items-center text-left text-[13px] text-[#666] hover:text-[#333]"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <style>{`
          .sidebar-scroll::-webkit-scrollbar {
            width: 3px;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: #8a8a8a;
            border-radius: 10px;
          }
          .sidebar-scroll::-webkit-scrollbar-track {
            background: #ececec;
            border-radius: 10px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default MenuSidebar;
