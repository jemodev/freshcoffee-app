import { UserSchema } from "@/types/types.auth";

// Data Access Layer for authentication-related operations
export const guestCredentials = {
    username: import.meta.env.GUEST_USER,
    password: import.meta.env.GUEST_PASSWORD,
};

export const verifySession = async (token: string) => {
    if (!token) {
        return { user: null };
    }

    const res = await fetch(`${import.meta.env.API_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    const user = UserSchema.safeParse(data);

    if (!user.success) {
        return { user: null };
    }

    return { user: user.data };
};
