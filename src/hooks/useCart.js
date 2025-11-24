import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  addToCart as addToCartAction,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction
} from '../features/cart/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const getCart = useCallback(async () => {
    try {
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    }
  }, [dispatch]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await dispatch(addToCartAction({ productId, quantity })).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }, [dispatch]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      await dispatch(updateCartItemAction({ itemId, quantity })).unwrap();
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  }, [dispatch]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await dispatch(removeFromCartAction(itemId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  }, [dispatch]);

  const clear = useCallback(async () => {
    try {
      await dispatch(clearCartAction()).unwrap();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }, [dispatch]);

  return {
    cart,
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart: clear,
    loading: cart.loading,
    error: cart.error
  };
};