"use client";

import { useState, useEffect } from 'react';
import { Seat } from '@/types';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';

// Mock data generator for seats
const generateMockSeats = (rows: number, cols: number): Seat[] => {
    const seats: Seat[] = [];
    const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let r = 0; r < rows; r++) {
        for (let c = 1; c <= cols; c++) {
            const rowLabel = rowLabels[r];
            const id = `${rowLabel}${c}`;

            // Randomly assign status for demo purposes
            const rand = Math.random();
            let status: Seat['status'] = 'AVAILABLE';
            if (rand > 0.85) status = 'RESERVED';
            else if (rand > 0.80) status = 'LOCKED'; // Simulating concurrency lock

            seats.push({
                id,
                row: rowLabel,
                col: c,
                status,
                price: 14000,
                type: 'STANDARD',
            });
        }
    }
    return seats;
};

export function SeatMap() {
    const [seats, setSeats] = useState<Seat[]>([]);
    const { selectedSeats, selectSeat, deselectSeat, maxSelectable } = useBookingStore();

    // Simulate fetching seat data
    useEffect(() => {
        const mockSeats = generateMockSeats(8, 12); // 8 rows, 12 cols
        setSeats(mockSeats);
    }, []);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'RESERVED' || seat.status === 'LOCKED') return;

        const isSelected = selectedSeats.some((s) => s.id === seat.id);

        if (isSelected) {
            deselectSeat(seat.id);
        } else {
            if (selectedSeats.length >= maxSelectable) {
                alert(`최대 ${maxSelectable}명까지 선택 가능합니다.`);
                return;
            }

            // Simulating backend concurrency check
            // In a real app, this might be an optimistic update or a request
            if (Math.random() > 0.95) { // 5% chance of conflict
                alert("이미 선택된 좌석입니다. 다시 선택해주세요.");
                // Refresh seat data logic would go here
                return;
            }

            selectSeat({ ...seat, status: 'SELECTED' });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-secondary/30 rounded-xl border border-border">
            {/* Screen Area */}
            <div className="mb-12 relative">
                <div className="w-3/4 mx-auto h-2 bg-primary/50 rounded-full shadow-[0_0_30px_rgba(229,9,20,0.5)]"></div>
                <p className="text-center text-sm text-muted-foreground mt-4">SCREEN</p>
            </div>

            {/* Seat Grid */}
            <div className="grid gap-4 justify-center">
                {Array.from(new Set(seats.map(s => s.row))).map(row => (
                    <div key={row} className="flex items-center gap-4">
                        <span className="w-6 text-center text-sm font-bold text-muted-foreground">{row}</span>
                        <div className="flex gap-2">
                            {seats.filter(s => s.row === row).map(seat => {
                                const isSelected = selectedSeats.some(s => s.id === seat.id);
                                const isReserved = seat.status === 'RESERVED';
                                const isLocked = seat.status === 'LOCKED';

                                return (
                                    <button
                                        key={seat.id}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={isReserved || isLocked}
                                        className={cn(
                                            "w-8 h-8 rounded-t-lg text-[10px] font-medium transition-all duration-200",
                                            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                                            isReserved && "bg-muted text-muted-foreground cursor-not-allowed",
                                            isLocked && "bg-muted text-muted-foreground cursor-not-allowed opacity-50", // Locked looks like reserved but maybe different visual cue if needed
                                            !isReserved && !isLocked && !isSelected && "bg-secondary hover:bg-primary/50 text-foreground",
                                            isSelected && "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                                        )}
                                        title={`${seat.row}${seat.col} - ${seat.price.toLocaleString()}원`}
                                    >
                                        {seat.col}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-12 flex justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-t bg-secondary"></div>
                    <span>선택가능</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-t bg-primary"></div>
                    <span>선택됨</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-t bg-muted"></div>
                    <span>예매완료</span>
                </div>
            </div>

            {/* Selection Summary */}
            <div className="mt-8 p-4 bg-background rounded-lg border border-border flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">선택 좌석</p>
                    <p className="font-bold text-lg">
                        {selectedSeats.length > 0
                            ? selectedSeats.map(s => s.id).join(', ')
                            : '-'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground text-right">총 결제금액</p>
                    <p className="font-bold text-xl text-primary">
                        {selectedSeats.reduce((acc, s) => acc + s.price, 0).toLocaleString()}원
                    </p>
                </div>
            </div>
        </div>
    );
}
