export interface User {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
}

export interface Movie {
    id: number;
    title: string;
    posterUrl: string;
    backdropUrl?: string;
    releaseDate: string;
    durationMin: number;
    genre: string[];
    rating: number;
    description: string;
    status: 'NOW_PLAYING' | 'COMING_SOON';
}

export interface Seat {
    id: string; // e.g., "A1", "B2"
    row: string;
    col: number;
    status: 'AVAILABLE' | 'RESERVED' | 'SELECTED' | 'LOCKED';
    price: number;
    type: 'STANDARD' | 'PREMIUM' | 'COUPLE';
}

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: 'SNACK' | 'GOODS';
    description?: string;
}

export interface CartItem extends Product {
    quantity: number;
}
