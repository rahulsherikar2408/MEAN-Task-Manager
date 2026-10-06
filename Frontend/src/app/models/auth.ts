export interface SignupRequest{
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface User{
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse{
    message: string;
    token: string;
    user: User;
}

