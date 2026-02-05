"use client";

import { Truck } from 'lucide-react';

export interface ShippingInfo {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    shippingAddress: string;
    shippingAddressDetail: string;
    deliveryMemo: string;
}

interface AddressInputProps {
    value: ShippingInfo;
    onChange: (value: ShippingInfo) => void;
}

export function AddressInput({ value, onChange }: AddressInputProps) {
    const handleChange = (field: keyof ShippingInfo, newValue: string) => {
        onChange({ ...value, [field]: newValue });
    };

    return (
        <div className="bg-background border border-border rounded-[2.5rem] p-10 space-y-8 shadow-2xl shadow-black/[0.02]">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Truck className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Shipping Information</h2>
                    <p className="text-sm font-medium text-muted-foreground">상품을 받으실 배송지 정보를 입력해주세요.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">수령인 성함</label>
                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={value.recipientName}
                        onChange={(e) => handleChange('recipientName', e.target.value)}
                        className="w-full px-5 py-4 bg-secondary/20 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">연락처</label>
                    <input
                        type="text"
                        placeholder="010-0000-0000"
                        value={value.recipientPhone}
                        onChange={(e) => handleChange('recipientPhone', e.target.value)}
                        className="w-full px-5 py-4 bg-secondary/20 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">우편번호</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="우편번호"
                            value={value.zipCode}
                            onChange={(e) => handleChange('zipCode', e.target.value)}
                            className="w-32 px-5 py-4 bg-secondary/20 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                        />
                    </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">주소</label>
                    <input
                        type="text"
                        placeholder="기본 주소를 입력하세요"
                        value={value.shippingAddress}
                        onChange={(e) => handleChange('shippingAddress', e.target.value)}
                        className="w-full px-5 py-4 bg-secondary/20 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">상세 주소</label>
                    <input
                        type="text"
                        placeholder="나머지 상세 주소를 입력하세요"
                        value={value.shippingAddressDetail}
                        onChange={(e) => handleChange('shippingAddressDetail', e.target.value)}
                        className="w-full px-5 py-4 bg-secondary/20 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">배송 메모 (선택)</label>
                    <textarea
                        placeholder="배송 기사님께 전달할 메시지를 적어주세요"
                        value={value.deliveryMemo}
                        onChange={(e) => handleChange('deliveryMemo', e.target.value)}
                        className="w-full px-5 py-4 bg-secondary/20 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold min-h-[100px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
