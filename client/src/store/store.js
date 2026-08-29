import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import shopProductSlice from "./shop/product-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";
// import shopOrderReducer from "./shop/order-slice";
// import adminOrderReducer from "./admin/order-slice";
import shopOrderSlice from "./shop/order-slice"
import shopSearchSlice from "./shop/search-slice"

const store = configureStore({
    reducer : {
        auth : authReducer,
        adminProducts : adminProductsSlice,
        adminOrder : adminOrderSlice,
        shopProducts : shopProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopReview: shopReviewSlice,
        commonFeature: commonFeatureSlice,
        shopOrder: shopOrderSlice,
        shopSearch : shopSearchSlice,
    }, 
    
});

export default store;