import {z} from "zod";

export const CreateProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    tags: z.array(z.string()),
})

export const UpdateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    tags: z.array(z.string()).optional(),
})
