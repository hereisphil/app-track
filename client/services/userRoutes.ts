import { LoginData, SignUpData, User } from "../types/userTypes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const fetchData = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getLoggedInUser = async (): Promise<User> => {
    const response = await fetchData(`${BASE_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }

    const data: User = await response.json();
    return data;
};

export const signUpUser = async (signUpData: SignUpData): Promise<User> => {
    const response = await fetchData(`${BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
    });

    if (!response.ok) {
        throw new Error("Failed to sign up user");
    }

    const data: User = await response.json();
    return data;
};

export const loginUser = async (loginData: LoginData): Promise<User> => {
    const response = await fetchData(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        throw new Error("Failed to log in user");
    }

    const data: User = await response.json();
    return data;
};

export const logoutUser = async (): Promise<void> => {
    const response = await fetchData(`${BASE_URL}/users/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to log out user");
    }
};
