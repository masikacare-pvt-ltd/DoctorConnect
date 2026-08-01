import { createAuthClient } from "better-auth/react"

const authBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
    (import.meta.env.PROD ? window.location.origin : "http://localhost:5000");

export const authClient = createAuthClient({
    baseURL: authBaseUrl,
    basePath: "/api/auth",
    fetchOptions: { credentials: "include" },
})

export const { signIn, signUp, signOut, useSession } = authClient;
