# 📁 JustEat Bharat - Complete File Structure Documentation

> **Purpose:** Is document mein har file ka detailed explanation hai taki aap project ko aasani se samajh aur reorganize kar sakein.

---

## 🎯 Root Level Files

### Configuration Files
- **`package.json`** - Project dependencies aur scripts (npm run dev, build, etc.)
- **`package-lock.json`** - Exact dependency versions lock file
- **`vite.config.js`** - Vite build tool configuration
- **`vitest.config.js`** - Testing framework setup
- **`tailwind.config.js`** - TailwindCSS styling configuration
- **`postcss.config.js`** - PostCSS configuration for CSS processing
- **`eslint.config.js`** - Code linting rules
- **`components.json`** - Shadcn/ui components configuration
- **`.gitignore`** - Git ignore patterns
- **`bun.lockb`** - Bun package manager lock file

### Entry Files
- **`index.html`** - Main HTML entry point (meta tags, title, root div)
- **`README.md`** - Project overview documentation

---

## 📂 `/src` - Main Source Code

### 🚀 Application Entry Points

#### `main.jsx` - **React Application Bootstrap**
```
Purpose: Application ka starting point
- React app ko DOM mein mount karta hai
- Root element (#root) ko initialize karta hai
```

#### `App.jsx` - **Root Component & Router Setup**
```
Purpose: Application ka main wrapper
- React Router setup (routing)
- QueryClient setup (data fetching)
- CartProvider setup (shopping cart state)
- Global layout structure
```

#### `App.css` - **Global Application Styles**
```
Purpose: Application-wide CSS styles
```

#### `index.css` - **Base & Tailwind Styles**
```
Purpose: Tailwind directives aur base styles
```

---

## 📄 `/src/pages` - Page Components

### `Index.jsx` - **Home Page (Main Landing)**
```
Purpose: Application ka main page
Components used:
- Header
- HeroBanner
- StoreInfo
- OffersStrip
- BestsellerStrip
- MenuItemCard (menu display)
- FilterBar
- CartBar
- FloatingMenuBar
- Sidebar

Features:
- Menu items display karein
- Category filtering
- Search functionality
- Cart management UI
```

### `NotFound.jsx` - **404 Error Page**
```
Purpose: Invalid routes ke liye fallback page
- 404 error message
- "Go Home" button
```

---

## 🧩 `/src/components` - Feature Components

### Core Layout Components

#### `Header.jsx` - **Top Navigation Bar**
```
Purpose: Site ka top header
Features:
- Logo/branding
- Navigation links
- User menu
- Mobile responsive hamburger menu
```

#### `Sidebar.jsx` - **Side Navigation Menu**
```
Purpose: Side navigation drawer
Features:
- Mobile drawer navigation
- Menu categories
- Quick links
```

#### `FloatingMenuBar.jsx` - **Bottom Sticky Menu (Mobile)**
```
Purpose: Mobile devices ke liye bottom sticky navigation
Features:
- Category quick access
- Always visible on scroll
- Mobile-first design
```

---

### Banner & Promotional Components

#### `HeroBanner.jsx` - **Main Hero Section**
```
Purpose: Homepage ka top banner
Features:
- Eye-catching promotional content
- Call-to-action buttons
- Hero image/background
```

#### `OffersStrip.jsx` - **Offers Banner Strip**
```
Purpose: Promotional offers display
Features:
- Discount badges
- Special offers ticker
- Coupon codes
```

#### `BestsellerStrip.jsx` - **Bestseller Items Carousel**
```
Purpose: Popular items showcase
Features:
- Horizontal scrollable carousel
- Bestseller products
- Quick add to cart
```

---

### Store Information

#### `StoreInfo.jsx` - **Restaurant Information Card**
```
Purpose: Store details display
Features:
- Order type selection (Dine-in/Takeaway)
- Store timing
- Rating & reviews
- Location info
```

---

### Menu & Product Components

#### `MenuItemCard.jsx` - **Individual Menu Item Card**
```
Purpose: Single menu item display
Features:
- Product image
- Name, description, price
- Veg/Non-veg indicator
- Add to cart button
- Customization options
- Click to open ProductModal
```

#### `ProductModal.jsx` - **Product Details Modal**
```
Purpose: Full product details popup
Features:
- Large product image
- Full description
- Variant selection (size, toppings)
- Quantity selector
- Add to cart with customization
```

#### `FilterBar.jsx` - **Category & Search Filter**
```
Purpose: Menu filtering controls
Features:
- Category tabs (All, Veg, Non-veg, Beverages, etc.)
- Search input
- Sort options
- Active filter indicators
```

---

### Shopping Cart Components

#### `CartBar.jsx` - **Cart Summary Bar (Desktop)**
```
Purpose: Desktop view cart sidebar
Features:
- Cart items list
- Quantity controls (+/-)
- Item removal
- Subtotal calculation
- Checkout button
```

#### `CartPage.jsx` - **Full Cart Page**
```
Purpose: Dedicated cart page (mobile/checkout)
Features:
- All cart items detailed view
- Quantity management
- Price breakdown
- Coupon code input
- Proceed to checkout
- Empty cart state
```

---

### Navigation Components

#### `NavLink.jsx` - **Custom Navigation Link**
```
Purpose: Reusable navigation link component
Features:
- Active state styling
- React Router integration
- Accessibility support
```

#### `MenuSheet.jsx` - **Mobile Menu Drawer**
```
Purpose: Full-screen mobile menu
Features:
- Category navigation
- User profile links
- Settings
- Slide-in animation
```

---

## 🗂️ `/src/context` - State Management

### `CartContext.jsx` - **Shopping Cart Global State**
```
Purpose: Application-wide cart state management
Features:
- Add item to cart
- Remove item from cart
- Update item quantity
- Clear entire cart
- Cart items array
- Total calculation

Used by: All components that need cart access

Context Provider wraps: App.jsx
```

---

## 📊 `/src/data` - Static Data

### `menuData.js` - **Menu Items Database**
```
Purpose: Restaurant menu data
Contains:
- menuItems array (40+ food items)
  * id, name, description
  * price, category
  * image path
  * veg/non-veg flag
  * bestseller flag
  * variants (sizes, toppings)

- categories array
  * id, name, icon

Usage: Index.jsx imports this for menu display
```

---

## 🎨 `/src/components/ui` - Reusable UI Components (48 files)

> **Note:** Ye sab Radix UI aur Shadcn/ui based reusable components hain. Pure JavaScript/JSX (TypeScript removed).

### Layout & Structure
- **`card.jsx`** - Card container (header, content, footer)
- **`separator.jsx`** - Horizontal/vertical divider line
- **`aspect-ratio.jsx`** - Maintain aspect ratio wrapper
- **`scroll-area.jsx`** - Custom scrollbar area

### Navigation & Menus
- **`navigation-menu.jsx`** - Dropdown navigation menu
- **`menubar.jsx`** - Horizontal menu bar
- **`breadcrumb.jsx`** - Breadcrumb trail
- **`tabs.jsx`** - Tab navigation
- **`pagination.jsx`** - Page pagination controls
- **`sidebar.jsx`** - Advanced sidebar layout (collapsible)

### Overlays & Popups
- **`dialog.jsx`** - Modal dialog box
- **`alert-dialog.jsx`** - Confirmation dialog
- **`drawer.jsx`** - Slide-in drawer (mobile)
- **`sheet.jsx`** - Side sheet panel
- **`popover.jsx`** - Floating popover
- **`tooltip.jsx`** - Hover tooltip
- **`hover-card.jsx`** - Hover card popup
- **`context-menu.jsx`** - Right-click context menu
- **`dropdown-menu.jsx`** - Dropdown menu

### Forms & Inputs
- **`form.jsx`** - Form wrapper with validation
- **`input.jsx`** - Text input field
- **`textarea.jsx`** - Multi-line text input
- **`label.jsx`** - Form label
- **`select.jsx`** - Dropdown select
- **`checkbox.jsx`** - Checkbox input
- **`radio-group.jsx`** - Radio button group
- **`switch.jsx`** - Toggle switch
- **`slider.jsx`** - Range slider
- **`input-otp.jsx`** - OTP/PIN input
- **`calendar.jsx`** - Date picker calendar

### Buttons & Actions
- **`button.jsx`** - Primary button component
- **`toggle.jsx`** - Toggle button
- **`toggle-group.jsx`** - Toggle button group

### Feedback & Status
- **`alert.jsx`** - Alert message box
- **`toast.jsx`** - Toast notification
- **`toaster.jsx`** - Toast container
- **`sonner.jsx`** - Advanced toast notifications
- **`badge.jsx`** - Status badge
- **`progress.jsx`** - Progress bar
- **`skeleton.jsx`** - Loading skeleton
- **`use-toast.js`** - Toast hook

### Data Display
- **`table.jsx`** - Data table
- **`avatar.jsx`** - User avatar image
- **`chart.jsx`** - Recharts wrapper for charts
- **`accordion.jsx`** - Expandable accordion
- **`collapsible.jsx`** - Collapsible section
- **`carousel.jsx`** - Image/content carousel
- **`resizable.jsx`** - Resizable panels
- **`command.jsx`** - Command palette (⌘K style)

---

## 🔧 `/src/lib` - Utility Functions

### `utils.js` - **Helper Functions**
```
Purpose: Common utility functions
Contains:
- cn() - className merger (clsx + tailwind-merge)
- Other helper functions

Usage: Har component mein imported
```

### `imageMap.js` - **Image Path Mapping**
```
Purpose: Image paths ka centralized mapping
Contains:
- Food item images ka mapping
- Default fallback images
- Image URL generator functions

Usage: MenuItemCard.jsx, ProductModal.jsx
```

---

## 🪝 `/src/hooks` - Custom React Hooks

### `use-mobile.jsx` - **Mobile Device Detection**
```
Purpose: Screen size detect karna
Returns: isMobile (boolean)
Usage: Responsive components mein
Example: Mobile drawer vs desktop sidebar
```

### `use-toast.js` - **Toast Notifications Hook**
```
Purpose: Toast notifications manage karna
Functions:
- toast() - Show notification
- dismiss() - Hide notification

Usage: Form submissions, cart actions
```

---

## 🧪 `/src/test` - Test Files

### `setup.js` - **Test Environment Setup**
```
Purpose: Vitest configuration
- DOM environment setup
- Test utilities
```

### `example.test.js` - **Sample Test**
```
Purpose: Example test case
- Basic component testing
- Test patterns
```

---

## 🎨 `/public` - Static Assets

### `robots.txt`
```
Purpose: Search engine crawling instructions
```

### (Other static files)
- Images, fonts, favicons go here
- Directly accessible via URL

---

## 🗂️ Project Organization Summary

```
taste-trekker-town-main/
│
├── 📄 Entry & Config (Root)
│   ├── index.html (HTML entry)
│   ├── package.json (Dependencies)
│   ├── vite.config.js (Build config)
│   └── tailwind.config.js (Styling)
│
├── 📁 src/ (Source Code)
│   │
│   ├── 🚀 main.jsx (App Bootstrap)
│   ├── 🚀 App.jsx (Root Component)
│   │
│   ├── 📄 pages/ (Route Pages)
│   │   ├── Index.jsx (Home page)
│   │   └── NotFound.jsx (404 page)
│   │
│   ├── 🧩 components/ (UI Components)
│   │   ├── Header.jsx (Top nav)
│   │   ├── Sidebar.jsx (Side menu)
│   │   ├── HeroBanner.jsx (Hero section)
│   │   ├── MenuItemCard.jsx (Menu item)
│   │   ├── ProductModal.jsx (Product details)
│   │   ├── CartBar.jsx (Cart sidebar)
│   │   ├── CartPage.jsx (Cart page)
│   │   ├── FilterBar.jsx (Filters)
│   │   ├── StoreInfo.jsx (Store details)
│   │   └── ... (more components)
│   │   │
│   │   └── 🎨 ui/ (48 Reusable UI Components)
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── card.jsx
│   │       └── ... (more UI primitives)
│   │
│   ├── 🗂️ context/ (State Management)
│   │   └── CartContext.jsx (Cart state)
│   │
│   ├── 📊 data/ (Static Data)
│   │   └── menuData.js (Menu items database)
│   │
│   ├── 🔧 lib/ (Utilities)
│   │   ├── utils.js (Helper functions)
│   │   └── imageMap.js (Image mapping)
│   │
│   ├── 🪝 hooks/ (Custom Hooks)
│   │   ├── use-mobile.jsx (Device detection)
│   │   └── use-toast.js (Notifications)
│   │
│   └── 🧪 test/ (Testing)
│       ├── setup.js
│       └── example.test.js
│
└── 🎨 public/ (Static Assets)
    └── robots.txt
```

---

## 🔄 Component Dependency Flow

```
App.jsx
  └── CartContext.Provider (wraps everything)
      └── React Router
          └── Index.jsx (Home Page)
              ├── Header
              ├── HeroBanner
              ├── StoreInfo
              ├── OffersStrip
              ├── BestsellerStrip
              ├── FilterBar
              │   └── uses: menuData.js
              ├── MenuItemCard (multiple)
              │   ├── uses: menuData.js
              │   ├── uses: imageMap.js
              │   └── opens: ProductModal
              ├── ProductModal
              │   └── uses: CartContext
              ├── CartBar
              │   └── uses: CartContext
              ├── FloatingMenuBar
              └── Sidebar
```

---

## 📝 Key Data Flow

### 1. **Menu Display**
```
menuData.js → Index.jsx → MenuItemCard → ProductModal
```

### 2. **Cart Management**
```
ProductModal → CartContext.addItem()
CartBar/CartPage → CartContext (read cart)
CartBar → CartContext.updateQuantity()
CartBar → CartContext.removeItem()
```

### 3. **Filtering**
```
FilterBar (user input) → Index.jsx (filter state) → MenuItemCard (filtered display)
```

### 4. **Styling**
```
tailwind.config.js → index.css → All Components
utils.js (cn function) → All Components (className merging)
```

---

## 🎯 Files Ka Purpose - Quick Reference

| File Category | Count | Purpose |
|--------------|-------|---------|
| **Page Components** | 2 | Route pages (Home, 404) |
| **Feature Components** | 14 | Main app features (Header, Cart, Menu) |
| **UI Components** | 48 | Reusable UI primitives (Button, Dialog, etc.) |
| **State Management** | 1 | Global cart state (CartContext) |
| **Data Files** | 1 | Menu database (menuData.js) |
| **Utilities** | 2 | Helper functions (utils, imageMap) |
| **Hooks** | 2 | Custom React hooks (mobile, toast) |
| **Config Files** | 8 | Build & tool configuration |
| **Test Files** | 2 | Testing setup & examples |

---

## 🔧 Reorganization Tips

### Option 1: Feature-Based Structure
```
src/
├── features/
│   ├── menu/
│   │   ├── MenuItemCard.jsx
│   │   ├── ProductModal.jsx
│   │   ├── FilterBar.jsx
│   │   └── menuData.js
│   ├── cart/
│   │   ├── CartContext.jsx
│   │   ├── CartBar.jsx
│   │   └── CartPage.jsx
│   └── layout/
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── FloatingMenuBar.jsx
```

### Option 2: Domain-Based Structure
```
src/
├── modules/
│   ├── restaurant/
│   │   ├── StoreInfo.jsx
│   │   ├── HeroBanner.jsx
│   │   └── OffersStrip.jsx
│   ├── catalog/
│   │   └── [menu components]
│   └── checkout/
│       └── [cart components]
```

### Option 3: Clean Architecture
```
src/
├── core/ (business logic)
├── presentation/ (UI components)
├── infrastructure/ (API, storage)
└── shared/ (utilities, hooks)
```

---

## ✅ Currently Working Files (Essential)

**DO NOT DELETE** - These files are actively used:

### Core Application (3)
- `main.jsx`, `App.jsx`, `index.html`

### Pages (2)
- `Index.jsx`, `NotFound.jsx`

### Active Feature Components (14)
- `Header.jsx`, `Sidebar.jsx`, `MenuSheet.jsx`
- `HeroBanner.jsx`, `OffersStrip.jsx`, `BestsellerStrip.jsx`
- `StoreInfo.jsx`, `FilterBar.jsx`
- `MenuItemCard.jsx`, `ProductModal.jsx`
- `CartBar.jsx`, `CartPage.jsx`, `FloatingMenuBar.jsx`
- `NavLink.jsx`

### State & Data (2)
- `CartContext.jsx`, `menuData.js`

### Utilities (4)
- `utils.js`, `imageMap.js`, `use-mobile.jsx`, `use-toast.js`

### UI Components (48)
- All files in `components/ui/` are imported by feature components

---

## ❓ Potentially Unused Files

### UI Components (Check if imported)
Run in terminal:
```bash
# Check usage of a file
grep -r "accordion" src/
```

If no imports found, consider these files for removal:
- `accordion.jsx` (if not using expandable sections)
- `calendar.jsx` (if no date picker)
- `chart.jsx` (if no analytics charts)
- `command.jsx` (if no command palette)
- `input-otp.jsx` (if no OTP input)
- `resizable.jsx` (if no resizable panels)
- Other unused ui components

### Test Files
- `test/example.test.js` (sample test, can remove after writing real tests)

---

## 🚀 Next Steps for Organization

1. **Identify unused UI components** (48 files mein se kaafi unused ho sakti hain)
2. **Create feature folders** (menu, cart, layout groups)
3. **Move related files together** (component + its data + its styles)
4. **Update import paths** carefully
5. **Test after every reorganization**

---

## 📞 Need Help?

Is documentation se aap:
- ✅ Har file ka purpose samajh sakte hain
- ✅ Dependencies trace kar sakte hain
- ✅ Unused files identify kar sakte hain
- ✅ Project ko reorganize kar sakte hain

**Agar kisi specific file ke baare mein detail chahiye, to bataiye!** 🎯
