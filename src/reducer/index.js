import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from "../slices/viewCourseSlice"

const rootReducer = combineReducers({
    auth:authReducer,
    cart:cartReducer,
    profile:profileReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})

export default rootReducer