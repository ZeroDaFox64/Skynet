import { create } from 'zustand';

interface FilterState {
    nameFilter: string;
    categoryFilter: string[];
    priceRangeFilter: { min: number; max: number };
    setNameFilter: (name: string) => void;
    setCategoryFilter: (category: string[]) => void;
    setPriceRangeFilter: (min: number, max: number) => void;
}

const useFilterStore = create<FilterState>((set) => ({
    nameFilter: '',
    categoryFilter: [],
    priceRangeFilter: { min: 0, max: 50 },
    setNameFilter: (name) => set({ nameFilter: name }),
    setCategoryFilter: (category) => set({ categoryFilter: category }),
    setPriceRangeFilter: (min, max) => set({ priceRangeFilter: { min, max } }),
}));

export default useFilterStore;
