"use client";

import { useEffect, useState } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(data.items);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                await productService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                alert('삭제 실패');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">상품 관리</h2>
                <Button onClick={() => alert('상품 등록 기능은 추후 구현 예정입니다.')}>상품 등록</Button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">상품명</th>
                                <th className="p-4 font-medium">카테고리</th>
                                <th className="p-4 font-medium">가격</th>
                                <th className="p-4 font-medium text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-border hover:bg-muted/10">
                                    <td className="p-4">{product.id}</td>
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">{product.price.toLocaleString()}원</td>
                                    <td className="p-4 text-right">
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
