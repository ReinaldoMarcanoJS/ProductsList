export type User = {
    id: string
    name: string;
    email: string;
    password?: string;
    created_at: string;
    updated_at: string;
}

export type Logged = {
        logged: boolean;
        token?: string | null;
}

