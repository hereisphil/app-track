export interface UserResponse {
    message: string;
    success: boolean;
    user: {
        email: string;
        id: string;
    };
}

export interface User {
    id: string;
    email: string;
    opportunities?: string[];
}

export interface SignUpData {
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}
