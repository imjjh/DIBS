import { create } from 'zustand';
import { Seat } from '@/types';

interface BookingState {
    selectedSeats: Seat[];
    maxSelectable: number;
    selectSeat: (seat: Seat) => void;
    deselectSeat: (seatId: string) => void;
    clearSelection: () => void;
    setMaxSelectable: (count: number) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    selectedSeats: [],
    maxSelectable: 8, // Default max seats

    selectSeat: (seat) => {
        const { selectedSeats, maxSelectable } = get();

        if (selectedSeats.find((s) => s.id === seat.id)) {
            return; // Already selected
        }

        if (selectedSeats.length >= maxSelectable) {
            // Ideally we should trigger a toast here, but for now we just return
            // The UI component can check this length to show feedback
            return;
        }

        set({ selectedSeats: [...selectedSeats, seat] });
    },

    deselectSeat: (seatId) => {
        const { selectedSeats } = get();
        set({ selectedSeats: selectedSeats.filter((s) => s.id !== seatId) });
    },

    clearSelection: () => {
        set({ selectedSeats: [] });
    },

    setMaxSelectable: (count) => {
        set({ maxSelectable: count });
    },
}));
