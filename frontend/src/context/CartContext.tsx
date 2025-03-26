import { CartItem } from '../types/CartItem';
import { createContext, useState, useContext, ReactNode } from 'react';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: CartItem) => void;
  removeFromCart: (bookID: number, quantityToRemove: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookID === book.bookID);
      const updatedCart = prevCart.map((item) => {
        return item.bookID === book.bookID
          ? { ...item, quantity: item.quantity + book.quantity, cost: item.cost + book.cost }
          : item;
      });
      return existingItem ? updatedCart : [...prevCart, book];
    });
  };

  const removeFromCart = (bookID: number, quantityToRemove: number) => {
    setCart((prevCart) =>
      prevCart.flatMap((item) => {
        if (item.bookID === bookID) {
          return {
            ...item,
            quantity: item.quantity - quantityToRemove,
            cost: item.cost - ((item.cost/item.quantity) * quantityToRemove),
          };
        }
        return item;
      }).filter((item) => item.quantity > 0) // Remove items with quantity 0
    );
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
