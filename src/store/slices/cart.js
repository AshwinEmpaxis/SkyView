// third-party
import { createSlice } from '@reduxjs/toolkit';
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  checkout: {
    step: 0,
    products: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    payment: {
      type: 'free',
      method: 'cod',
      card: ''
    }
  }
};

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    addProductSuccess(state, action) {
      state.checkout.products = action.payload.products;
      state.checkout.subtotal += action.payload.subtotal;
      state.checkout.total += action.payload.subtotal;
    },
    removeProductSuccess(state, action) {
      state.checkout.products = action.payload.products;
      state.checkout.subtotal += -action.payload.subtotal;
      state.checkout.total += -action.payload.subtotal;
    },
    updateProductSuccess(state, action) {
      state.checkout.products = action.payload.products;
      state.checkout.subtotal = state.checkout.subtotal - action.payload.oldSubTotal + action.payload.subtotal;
      state.checkout.total = state.checkout.total - action.payload.oldSubTotal + action.payload.subtotal;
    },
    setStepSuccess(state, action) {
      state.checkout.step = action.payload;
    },
    setNextStepSuccess(state) {
      state.checkout.step += 1;
    },
    setBackStepSuccess(state) {
      state.checkout.step -= 1;
    },
    setBillingAddressSuccess(state, action) {
      state.checkout.billing = action.payload.billing;
    },
    setDiscountSuccess(state, action) {
      let difference = 0;
      if (state.checkout.discount > 0) {
        difference = state.checkout.discount;
      }
      state.checkout.discount = action.payload.amount;
      state.checkout.total = state.checkout.total + difference - action.payload.amount;
    },
    setShippingChargeSuccess(state, action) {
      state.checkout.shipping = action.payload.shipping;
      state.checkout.total += action.payload.newShipping;
      state.checkout.payment = {
        ...state.checkout.payment,
        type: action.payload.type
      };
    },
    setPaymentMethodSuccess(state, action) {
      state.checkout.payment = {
        ...state.checkout.payment,
        method: action.payload.method
      };
    },
    setPaymentCardSuccess(state, action) {
      state.checkout.payment = {
        ...state.checkout.payment,
        card: action.payload.card
      };
    },
    resetCardSuccess(state) {
      state.checkout = initialState.checkout;
    }
  }
});

// Reducer
export default slice.reducer;

// Action creators
export const {
  hasError,
  addProductSuccess,
  removeProductSuccess,
  updateProductSuccess,
  setStepSuccess,
  setNextStepSuccess,
  setBackStepSuccess,
  setBillingAddressSuccess,
  setDiscountSuccess,
  setShippingChargeSuccess,
  setPaymentMethodSuccess,
  setPaymentCardSuccess,
  resetCardSuccess
} = slice.actions;

export function addProduct(product, products) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/add', { product, products });
      dispatch(addProductSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function removeProduct(id, products) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/remove', { id, products });
      dispatch(removeProductSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function updateProduct(id, quantity, products) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/update', { id, quantity, products });
      dispatch(updateProductSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function setStep(step) {
  return () => {
    dispatch(setStepSuccess(step));
  };
}

export function setNextStep() {
  return () => {
    dispatch(setNextStepSuccess({}));
  };
}

export function setBackStep() {
  return () => {
    dispatch(setBackStepSuccess({}));
  };
}

export function setBillingAddress(address) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/billing-address', { address });
      dispatch(setBillingAddressSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function setDiscount(code, total) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/discount', { code, total });
      dispatch(setDiscountSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function setShippingCharge(charge, shipping) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/shipping-charge', { charge, shipping });
      dispatch(setShippingChargeSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function setPaymentMethod(method) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/payment-method', { method });
      dispatch(setPaymentMethodSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function setPaymentCard(card) {
  return async () => {
    try {
      const response = await axios.post('/api/cart/payment-card', { card });
      dispatch(setPaymentCardSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function resetCart() {
  return async () => {
    try {
      const response = await axios.post('/api/cart/reset');
      dispatch(resetCardSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
