import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../features/todos/todoSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { testApi } from '../apis/api' 

export const store = configureStore({
    reducer: {
        todos: todoReducer,
        [testApi.reducerPath]: testApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(testApi.middleware),
})

setupListeners(store.dispatch)