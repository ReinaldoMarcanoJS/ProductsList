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

export type Product = {
    id?: string;
    name: string;
    userId?: string;
    code: number
    price: number;
    createdAt: Date;
    updatedAt: Date;
};
export type DolarQuery = {
    fuente: string;
    nombre: string;
    compra: number | null;
    venta: number | null;
    promedio: number;
    fechaActualizacion: string;
}

export type Client = {
    id?: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}