import { z } from "astro:content";

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    role: z.string(),
});
