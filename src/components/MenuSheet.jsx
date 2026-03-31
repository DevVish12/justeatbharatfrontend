import { X } from "lucide-react";

const MenuSheet = ({ isOpen, onClose, onCategoryClick, filteredItems }) => {
  const handleClick = (name) => {
    onCategoryClick(name);
    onClose();
  };

  const categories =
    filteredItems && typeof filteredItems === "object"
      ? Object.entries(filteredItems).map(([name, items]) => ({
          name,
          count: Array.isArray(items) ? items.length : 0,
        }))
      : [];

  return (
    <>
      <div
        className={`fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl transition-transform duration-300 max-h-[75vh] flex flex-col ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground">Menu</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleClick(cat.name)}
              className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-muted/50 transition-colors border-b border-border/50"
            >
              <span className="text-sm font-medium text-foreground">
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({cat.count})
              </span>
            </button>
          ))}

          {categories.length === 0 && (
            <div className="px-5 py-8 text-sm text-muted-foreground">
              No items found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuSheet;
