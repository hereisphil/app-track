export interface User {
    email: string;
    id: string;
    opportunities?: number[];
}

export interface SignUpData {
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}
