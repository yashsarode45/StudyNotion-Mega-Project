import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    loading:false
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData: (state,value) =>{
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
          setToken(state, value) {
            state.token = value.payload;
          },
    }
})

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;