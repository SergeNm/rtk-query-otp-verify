import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Otp'],
    endpoints: (builder) => ({
        getOtp: builder.query({
            query: (user) => '/otp/' + user,
            transformResponse: (res: any, meta, args) => {
                return { ...res, message: "successfully fetched", user: args }
            },
            providesTags: ['Otp']
        }),
        addOtp: builder.mutation({
            query: (otp) => ({
                url: '/otp',
                method: 'POST',
                body: otp
            }),
            invalidatesTags: ['Otp']
        }),
        deleteOtp: builder.mutation({
            query: (id) => ({
                url: `/otp/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Otp']
        }),
        changeOtp: builder.mutation({
            query: ([otp, user]) => ({
                url: `/otp/${user}`,
                method: 'PUT',
                body: { secret: otp }
            }),
            invalidatesTags: ['Otp']

        })
    })
})

export const { useGetOtpQuery, useAddOtpMutation, useDeleteOtpMutation, useChangeOtpMutation } = apiSlice;
