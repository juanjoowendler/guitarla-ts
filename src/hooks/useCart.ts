import { useState, useEffect } from "react";
import { db } from "../data/db.ts";
import { useMemo } from "react";
import type { CartItem, Guitar } from "../types/types.ts";

const useCart = () => {
  // localStorage
  const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem("cart"); // recupero del carrito
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  // State
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart());

  const maxItems = 5;
  const minItems = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item : Guitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists === -1) {
      const newItem : CartItem = {...item, quantity: 1}
      setCart([...cart, newItem]);
    } else {
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    }
  }

  function removeFromCart(id : Guitar["id"]) {
    setCart((cart) => cart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id : Guitar["id"]) {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity < maxItems) {
        return {
          ...guitar,
          quantity: guitar.quantity + 1,
        };
      }
      return guitar;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id : Guitar["id"]) {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity > minItems) {
        return {
          ...guitar,
          quantity: guitar.quantity - 1,
        };
      }
      return guitar;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  // State derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, guitar) => (total + guitar.price * guitar.quantity), 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty, 
    cartTotal,
  };
};

export default useCart;