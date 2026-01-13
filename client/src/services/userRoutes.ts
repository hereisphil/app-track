import type {
    LoginData,
    SignUpData,
    User,
    UserResponse,
} from "../@types/userTypes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Generic API response shape that matches backend
type ApiSuccess<T> = { success: true; message: string; user: T };
type ApiFail = { success: false; message: string };
type ApiResponse<T> = ApiSuccess<T> | ApiFail;

/**
 * Fetch helper that:
 * - sends cookies (sessions) via credentials: "include"
 * - parses JSON exactly once
 * - throws a useful error message on non-2xx
 */
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        credentials: "include", // IMPORTANT for express-session cookies
    });
    // Handle no content response for logout
    if (res.status === 204) {
        return { success: true, message: "User logged out successfully" } as T;
    }

    // Parse once
    const data = (await res.json()) as unknown;
    // If not ok, try to surface backend message
    if (!res.ok) {
        const message =
            typeof data === "object" && data !== null && "message" in data
                ? String(data.message)
                : `HTTP error! status: ${res.status}`;
        throw new Error(message);
    }

    return data as T;
}

export async function getLoggedInUser(): Promise<User> {
    const data = await fetchJson<UserResponse>("/users", { method: "GET" });
    const user: User = data.user;
    return user;
}

export async function signUpUser(signUpData: SignUpData): Promise<User> {
    const data = await fetchJson<ApiResponse<User>>("/users/signup", {
        method: "POST",
        body: JSON.stringify(signUpData),
    });

    if (!data.success) {
        throw new Error(data.message);
    }

    return data.user;
}

export async function loginUser(loginData: LoginData): Promise<User> {
    const data = await fetchJson<ApiResponse<User>>("/users/login", {
        method: "POST",
        body: JSON.stringify(loginData),
    });

    if (!data.success) throw new Error(data.message);

    return data.user;
}

export async function logoutUser(): Promise<void> {
    const response = await fetchJson<{ success: boolean; message?: string }>(
        "/users/logout",
        {
            method: "POST",
        }
    );
    console.log("Logout response:", response);
}
