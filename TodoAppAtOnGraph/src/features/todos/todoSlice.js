import { createSlice } from '@reduxjs/toolkit'


const initialState =  [];
const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers : {
        updateTodos:(state,action)=>{
            // return action.payload;
            state.length = 0; // Clear the existing todos
            state.push(...action.payload); // Push the new todos
        }
    }
})

export const { updateTodos } = todoSlice.actions
export default todoSlice.reducer