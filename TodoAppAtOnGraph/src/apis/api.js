import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://websocketchatapp.tanujagupta.repl.co/' }),
  endpoints: (builder) => ({
    getJson: builder.query({
      query: (name) => `${name}`,
    }),
    getAllTodos: builder.mutation({
        query: ( jsonData ) => ({
          url: 'https://websocketchatapp.tanujagupta.repl.co/getTodos',
          method: 'POST',
          body: jsonData,
        }),
      }),      
    addTodo: builder.mutation({
        query: ( jsonData ) => ({
          url: 'https://websocketchatapp.tanujagupta.repl.co/add',
          method: 'POST',
          body: jsonData,
        }),
      }),      
  }),
});

// Export hooks for usage in functional components
export const { useGetJsonQuery, useGetAllTodosMutation, useAddTodoMutation } = testApi;
