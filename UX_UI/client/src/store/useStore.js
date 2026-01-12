import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // Filters
            selectedCuisines: [],
            selectedPrices: [],
            
            // Result State
            recommendation: null,
            loading: false,
            hasSearched: false,
            error: null,

            // History (최근 방문 기록)
            recentHistory: [], // Stores restaurant IDs

            // Actions
            toggleCuisine: (cuisine) => set((state) => {
                const list = state.selectedCuisines.includes(cuisine)
                    ? state.selectedCuisines.filter((c) => c !== cuisine)
                    : [...state.selectedCuisines, cuisine];
                return { selectedCuisines: list };
            }),

            togglePrice: (price) => set((state) => {
                const list = state.selectedPrices.includes(price)
                    ? state.selectedPrices.filter((p) => p !== price)
                    : [...state.selectedPrices, price];
                return { selectedPrices: list };
            }),

            resetFilters: () => set({ selectedCuisines: [], selectedPrices: [] }),

            addToHistory: (id) => set((state) => {
                // 최근 3개만 유지 (N=3)
                const newHistory = [id, ...state.recentHistory.filter(h => h !== id)].slice(0, 3);
                return { recentHistory: newHistory };
            }),

            clearHistory: () => set({ recentHistory: [] }),

            fetchRecommendation: async (ignoreHistory = false) => {
                set({ loading: true, error: null, hasSearched: true, recommendation: null });
                const { selectedCuisines, selectedPrices, recentHistory } = get();

                try {
                    const response = await fetch('http://localhost:3001/api/recommend', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            cuisines: selectedCuisines,
                            priceRanges: selectedPrices,
                            excludedIds: ignoreHistory ? [] : recentHistory
                        }),
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        set({ recommendation: data.data, loading: false });
                    } else {
                        // 결과 0건 처리
                        set({ recommendation: null, loading: false, error: 'NO_MATCH' });
                    }
                } catch (err) {
                    set({ error: 'SERVER_ERROR', loading: false });
                }
            },
            
            confirmSelection: () => {
                const { recommendation, addToHistory } = get();
                if (recommendation) {
                    addToHistory(recommendation.id);
                    alert(`${recommendation.name} 선택 완료! 맛있는 점심 되세요.`);
                    set({ recommendation: null, hasSearched: false });
                }
            }
        }),
        {
            name: 'lunch-recommender-storage', // LocalStorage Key
            partialize: (state) => ({ recentHistory: state.recentHistory }), // history만 영구 저장
        }
    )
);

export default useStore;