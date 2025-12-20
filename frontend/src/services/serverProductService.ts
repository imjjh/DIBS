"use server";

import { Product } from '@/types';

/**
 * Server-only service for data fetching in Server Components.
 * This reads non-NEXT_PUBLIC environment variables at runtime on the server.
 */
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function getProductsServer(): Promise<Product[]> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/products`, {
            cache: 'no-store', // Disable caching for real-time like experience or use revalidate
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error('Failed to fetch products from server');
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Server fetch error:', error);
        return [];
    }
}

export async function getProductByIdServer(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
            next: { revalidate: 3600 }, // Example: cache for 1 hour
        });

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Server fetch error:', error);
        return null;
    }
}
