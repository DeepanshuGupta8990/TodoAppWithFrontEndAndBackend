import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4500/' }),
  endpoints: (builder) => ({
    getJson: builder.query({
      query: (name) => `${name}`,
    }),
    getAllTodos: builder.mutation({
        query: ( jsonData ) => ({
          url: 'http://localhost:4500/getTodos',
          method: 'POST',
          body: jsonData,
        }),
      }),      
    addTodo: builder.mutation({
        query: ( jsonData ) => ({
          url: 'http://localhost:4500/add',
          method: 'POST',
          body: jsonData,
        }),
      }),      
  }),
});

// Export hooks for usage in functional components
export const { useGetJsonQuery, useGetAllTodosMutation, useAddTodoMutation } = testApi;
