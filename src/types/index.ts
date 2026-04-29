import { z } from "astro/zod";

const ImageSchema = z.object({
    url: z.string().url(),
    width: z.number(),
    height: z.number(),
});

const FeaturedImageSchema = z.object({
    thumbnail: ImageSchema,
    medium: ImageSchema,
    medium_large: ImageSchema,
    large: ImageSchema,
    full: ImageSchema,
});

const VariablePairSchema = z.object({
    price: z.coerce.number(),
    size: z.string(),
});

export const VariablePriceSchema = z.object({
    variable_price: z.literal(true),
    small: VariablePairSchema,
    medium: VariablePairSchema,
    large: VariablePairSchema,
});

const FixedPriceSchema = z.object({
    variable_price: z.literal(false),
    price: z.coerce.number(),
});

export const ProductPriceSchema = z.discriminatedUnion("variable_price", [
    VariablePriceSchema,
    FixedPriceSchema,
]);

const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    acf: z.object({
        icon: z.string().url(),
    }),
});

export const CategoriesSchema = z.array(CategorySchema);
export type Category = z.infer<typeof CategorySchema>;

const ProductSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
        rendered: z.string(),
    }),
    featured_media: z.number(),
    featured_images: FeaturedImageSchema,
    acf: ProductPriceSchema,
});

export const ProductsSchema = z.array(ProductSchema);
export type Product = z.infer<typeof ProductSchema>;

const ProductWithVariablePriceSchema = ProductSchema.extend({
    acf: VariablePriceSchema,
});

export type ProductWithVariablePrice = z.infer<
    typeof ProductWithVariablePriceSchema
>;

/** Orders - Client */
const SelectedProductSchema = z.object({
    id: z.number(),
    name: z
        .string()
        .min(1, { message: "El nombre del producto es obligatorio" }),
    price: z.number().min(1, { message: "Precio no válido" }),
    size: z.optional(
        z.string().min(1, {
            message: "El tamaño es obligatorio para productos variables",
        }),
    ),
});
export type SelectedProduct = z.infer<typeof SelectedProductSchema>;

export const OrderItemSchema = SelectedProductSchema.extend({
    quantity: z.number().min(1, { message: "La cantidad debe ser al menos 1" }),
    subtotal: z.number().min(1, { message: "La cantidad debe ser al menos 1" }),
    key: z.optional(
        z.string().min(1, { message: "La cantidad debe ser al menos 1" }),
    ),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderContentSchema = z.object({
    id: z.number(),
    title: z.string(),
    name: z.string(),
    contents: z.string(),
    status: z.string(),
    total: z.number(),
});
export type OrderContent = z.infer<typeof OrderContentSchema>;


