import {
  ADD_TO_CART,
  CLEAR_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from '../constants/cartConstants';
import axios from 'axios';
// import totalAmount from '../component/Product/ProductDetails';

// Add to Cart
export const addItemsToCart =
  (id, quantity, totalPaisa, from, to) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);
    // const { totalFinalAmount } = totalAmount;

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,

        image: data.product.images[0].url,
        stock: data.product.Stock,
        from,
        to,
        quantity,
        totalPaisa,
      },
    });
    console.log(from);

    console.log(to);

    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().cart.cartItems)
    );
  };

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

//CLEAR CART COMPLETELY
export const clearCart = () => async (dispatch, getState) => {
  dispatch({
    type: CLEAR_CART,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};
