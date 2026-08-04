import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductSlice from "./shop/product-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";
import shopOrderReducer from "./shop/order-slice";



const store = configureStore({
    reducer : {
        auth : authReducer,
        adminProducts : adminProductsSlice,
        shopProducts : shopProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopReview: shopReviewSlice,
        commonFeature: commonFeatureSlice,
        shopOrder: shopOrderReducer,
    }, 
    
});

export default store;