// import { createStore } from 'redux';
// import reducer from './reducer';

// // ==============================|| REDUX - MAIN STORE ||============================== //

// const store = createStore(reducer);
// const persister = 'Free';

// export { store, persister };
// -------------------------------------------------------------------------------------------------------------------------

// third-party
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';

// project imports
import rootReducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
});

const RootState = rootReducer;

const AppDispatch = store.dispatch;

const { dispatch } = store;

const useDispatch = () => useAppDispatch();
const useSelector = useAppSelector;

export { store, dispatch, useSelector, useDispatch, RootState, AppDispatch };
