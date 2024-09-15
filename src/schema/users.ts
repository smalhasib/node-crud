import {z} from "zod";

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const AddAddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    city: z.string(),
    country: z.string(),
    pincode: z.number(),
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddressId: z.number().optional(),
    defaultBillingAddressId: z.number().optional(),
})
