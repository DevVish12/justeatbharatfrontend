export const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Sandwich", icon: "🥪" },
  { name: "Pasta", icon: "🍝" },
  { name: "Nachos", icon: "🌮" },
  { name: "Garlic Bread", icon: "🥖" },
  { name: "Wrap", icon: "🌯" },
  { name: "Shakes", icon: "🥤" },
  { name: "Drinks", icon: "🥂" },
  { name: "Desserts", icon: "🍰" },
];

export const menuItems = [
  // Pizza
  { id: 1, name: "Farm House Pizza", price: 295, image: "pizza-1", category: "Pizza", isVeg: true, isBestseller: true, isNew: false, description: "Loaded with fresh capsicum, onion, tomato & mushroom on a cheesy base", variants: [{ name: "Small", price: 225 }, { name: "Medium", price: 545 }, { name: "Large", price: 685 }, { name: "Monster", price: 985 }] },
  { id: 2, name: "Paneer Tikka Pizza", price: 325, originalPrice: 375, image: "pizza-2", category: "Pizza", isVeg: true, isBestseller: true, isNew: false, description: "Spiced paneer chunks with onion & capsicum on a tandoori base", variants: [{ name: "Small", price: 225 }, { name: "Medium", price: 545 }, { name: "Large", price: 685 }, { name: "Monster", price: 985 }] },
  { id: 3, name: "Burn To Hell Pizza", price: 225, image: "pizza-3", category: "Pizza", isVeg: true, isBestseller: true, isNew: false, description: "Extra spicy pizza loaded with jalapenos, chilli flakes & hot sauce", variants: [{ name: "Small", price: 225 }, { name: "Medium", price: 545 }, { name: "Large", price: 685 }, { name: "Monster", price: 985 }] },
  { id: 4, name: "Chicken Tikka Pizza", price: 345, image: "pizza-4", category: "Pizza", isVeg: false, isBestseller: true, isNew: false, description: "Succulent chicken tikka with onion rings and spicy sauce", variants: [{ name: "Small", price: 295 }, { name: "Medium", price: 595 }, { name: "Large", price: 745 }, { name: "Monster", price: 1085 }] },
  { id: 5, name: "Margherita Classic", price: 169, image: "pizza-1", category: "Pizza", isVeg: true, isBestseller: false, isNew: false, description: "Classic pizza with mozzarella cheese and fresh basil", variants: [{ name: "Small", price: 169 }, { name: "Medium", price: 399 }, { name: "Large", price: 549 }] },
  { id: 6, name: "Veggie Supreme", price: 275, image: "pizza-3", category: "Pizza", isVeg: true, isBestseller: false, isNew: true, description: "Loaded with 7 types of veggies on a cheesy crust", variants: [{ name: "Small", price: 275 }, { name: "Medium", price: 575 }, { name: "Large", price: 725 }] },
  { id: 7, name: "BBQ Chicken Pizza", price: 375, originalPrice: 425, image: "pizza-4", category: "Pizza", isVeg: false, isBestseller: false, isNew: true, description: "Smoky BBQ chicken with caramelized onions", variants: [{ name: "Small", price: 325 }, { name: "Medium", price: 625 }, { name: "Large", price: 775 }] },
  { id: 8, name: "Peppy Paneer Pizza", price: 249, image: "pizza-2", category: "Pizza", isVeg: true, isBestseller: false, isNew: false, description: "Juicy paneer with crisp capsicum & spicy red paprika", variants: [{ name: "Small", price: 249 }, { name: "Medium", price: 499 }, { name: "Large", price: 649 }] },

  // Burger
  { id: 20, name: "Classic Veg Burger", price: 99, image: "burger-1", category: "Burger", isVeg: true, isBestseller: true, isNew: false, description: "Crunchy veg patty with lettuce, tomato & mayo" },
  { id: 21, name: "Paneer Zinger Burger", price: 149, originalPrice: 179, image: "burger-1", category: "Burger", isVeg: true, isBestseller: false, isNew: true, description: "Crispy paneer patty with spicy sauce & fresh veggies" },
  { id: 22, name: "Chicken Zinger Burger", price: 179, image: "burger-1", category: "Burger", isVeg: false, isBestseller: true, isNew: false, description: "Crispy chicken fillet with lettuce, cheese & zinger sauce" },
  { id: 23, name: "Double Decker Burger", price: 229, image: "burger-1", category: "Burger", isVeg: false, isBestseller: false, isNew: true, description: "Two juicy chicken patties stacked with cheese & sauces" },

  // Sandwich
  { id: 30, name: "Grilled Veg Sandwich", price: 129, image: "sandwich-1", category: "Sandwich", isVeg: true, isBestseller: false, isNew: false, description: "Grilled bread loaded with fresh veggies & cheese" },
  { id: 31, name: "Paneer Tikka Sandwich", price: 159, image: "sandwich-1", category: "Sandwich", isVeg: true, isBestseller: true, isNew: false, description: "Spiced paneer chunks grilled to perfection in a sandwich" },
  { id: 32, name: "Chicken Club Sandwich", price: 189, originalPrice: 229, image: "sandwich-1", category: "Sandwich", isVeg: false, isBestseller: false, isNew: true, description: "Triple-layered chicken sandwich with bacon & cheese" },

  // Pasta
  { id: 40, name: "Creamy White Pasta", price: 199, image: "pasta-1", category: "Pasta", isVeg: true, isBestseller: true, isNew: false, description: "Penne in rich creamy white sauce with herbs" },
  { id: 41, name: "Red Sauce Pasta", price: 179, image: "pasta-1", category: "Pasta", isVeg: true, isBestseller: false, isNew: false, description: "Classic penne arrabiata with tangy tomato sauce" },
  { id: 42, name: "Pink Sauce Chicken Pasta", price: 249, originalPrice: 299, image: "pasta-1", category: "Pasta", isVeg: false, isBestseller: false, isNew: true, description: "Creamy pink sauce pasta loaded with grilled chicken" },

  // Nachos
  { id: 50, name: "Loaded Nachos", price: 199, image: "nachos-1", category: "Nachos", isVeg: true, isBestseller: true, isNew: false, description: "Crispy nachos topped with cheese sauce, salsa & jalapenos" },
  { id: 51, name: "Mexican Chicken Nachos", price: 249, image: "nachos-1", category: "Nachos", isVeg: false, isBestseller: false, isNew: true, description: "Loaded nachos with spicy chicken, guacamole & sour cream" },

  // Garlic Bread
  { id: 60, name: "Classic Garlic Bread", price: 99, image: "garlicbread-1", category: "Garlic Bread", isVeg: true, isBestseller: true, isNew: false, description: "Freshly baked garlic bread with herbs & butter" },
  { id: 61, name: "Cheese Garlic Bread", price: 149, image: "garlicbread-1", category: "Garlic Bread", isVeg: true, isBestseller: false, isNew: false, description: "Garlic bread loaded with melted mozzarella cheese" },
  { id: 62, name: "Stuffed Garlic Bread", price: 179, originalPrice: 199, image: "garlicbread-1", category: "Garlic Bread", isVeg: true, isBestseller: false, isNew: true, description: "Garlic bread stuffed with paneer, corn & cheese" },

  // Wrap
  { id: 70, name: "Paneer Tikka Wrap", price: 149, image: "wrap-1", category: "Wrap", isVeg: true, isBestseller: false, isNew: false, description: "Spiced paneer wrapped in a soft tortilla with veggies" },
  { id: 71, name: "Chicken Tikka Wrap", price: 179, image: "wrap-1", category: "Wrap", isVeg: false, isBestseller: true, isNew: false, description: "Juicy chicken tikka rolled in a soft tortilla" },
  { id: 72, name: "Falafel Wrap", price: 159, image: "wrap-1", category: "Wrap", isVeg: true, isBestseller: false, isNew: true, description: "Crispy falafel with hummus and fresh veggies in a wrap" },

  // Shakes
  { id: 80, name: "Chocolate Shake", price: 149, image: "shake-1", category: "Shakes", isVeg: true, isBestseller: true, isNew: false, description: "Rich and creamy chocolate milkshake" },
  { id: 81, name: "Oreo Shake", price: 169, image: "shake-1", category: "Shakes", isVeg: true, isBestseller: false, isNew: true, description: "Creamy milkshake blended with crushed Oreo cookies" },
  { id: 82, name: "Strawberry Shake", price: 149, image: "shake-1", category: "Shakes", isVeg: true, isBestseller: false, isNew: false, description: "Fresh strawberry flavored milkshake" },

  // Drinks
  { id: 90, name: "Coke 250ml", price: 49, image: "drink-1", category: "Drinks", isVeg: true, isBestseller: false, isNew: false, description: "Chilled Coca-Cola 250ml can" },
  { id: 91, name: "Coke 500ml", price: 79, image: "drink-1", category: "Drinks", isVeg: true, isBestseller: false, isNew: false, description: "Chilled Coca-Cola 500ml bottle" },
  { id: 92, name: "Mojito", price: 129, image: "drink-1", category: "Drinks", isVeg: true, isBestseller: false, isNew: true, description: "Refreshing mint & lime virgin mojito" },

  // Desserts
  { id: 100, name: "Choco Lava Cake", price: 99, image: "dessert-1", category: "Desserts", isVeg: true, isBestseller: true, isNew: false, description: "Warm chocolate cake with a gooey molten center" },
  { id: 101, name: "Brownie with Ice Cream", price: 149, originalPrice: 179, image: "dessert-1", category: "Desserts", isVeg: true, isBestseller: false, isNew: false, description: "Warm chocolate brownie served with vanilla ice cream" },
  { id: 102, name: "Red Velvet Pastry", price: 129, image: "dessert-1", category: "Desserts", isVeg: true, isBestseller: false, isNew: true, description: "Soft and creamy red velvet pastry with cream cheese frosting" },
];
