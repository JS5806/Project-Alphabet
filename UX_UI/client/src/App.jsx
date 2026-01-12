import React from 'react';
import useStore from './store/useStore';
import './App.css';

// Components
const FilterChip = ({ label, selected, onClick }) => (
    <button 
        className={`chip ${selected ? 'selected' : ''}`} 
        onClick={onClick}
    >
        {label}
    </button>
);

const EmptyState = () => {
    const { fetchRecommendation, resetFilters, recentHistory } = useStore();
    
    return (
        <div className="empty-state">
            <div className="icon">🍽️</div>
            <h3>추천할 식당이 없어요!</h3>
            <p>선택하신 조건이 너무 까다롭거나,<br/>최근에 모두 방문한 곳들입니다.</p>
            
            <div className="button-group">
                {recentHistory.length > 0 && (
                    <button 
                        className="btn-secondary"
                        onClick={() => fetchRecommendation(true)} // ignoreHistory = true
                    >
                        최근 방문한 곳도 포함하기
                    </button>
                )}
                <button 
                    className="btn-primary"
                    onClick={() => {
                        resetFilters();
                        setTimeout(() => fetchRecommendation(false), 100);
                    }}
                >
                    조건 초기화 후 추천받기
                </button>
            </div>
        </div>
    );
};

const ResultCard = () => {
    const { recommendation, confirmSelection, fetchRecommendation } = useStore();

    if (!recommendation) return null;

    return (
        <div className="result-card">
            <div className="cuisine-tag">{recommendation.cuisine}</div>
            <h2>{recommendation.name}</h2>
            <p className="desc">{recommendation.description}</p>
            <div className="price-tag">{recommendation.price_range}</div>
            
            <div className="card-actions">
                <button className="btn-text" onClick={() => fetchRecommendation(false)}>
                    다시 뽑기 🎲
                </button>
                <button className="btn-primary" onClick={confirmSelection}>
                    여기로 결정! ✅
                </button>
            </div>
        </div>
    );
};

export default function App() {
    const { 
        selectedCuisines, toggleCuisine,
        selectedPrices, togglePrice,
        fetchRecommendation, loading, hasSearched, recommendation, error
    } = useStore();

    const CUISINES = [
        { key: 'KOREAN', label: '한식' },
        { key: 'CHINESE', label: '중식' },
        { key: 'JAPANESE', label: '일식' },
        { key: 'WESTERN', label: '양식' },
    ];

    const PRICES = [
        { key: 'CHEAP', label: '가성비' },
        { key: 'MEDIUM', label: '보통' },
        { key: 'EXPENSIVE', label: '플렉스' },
    ];

    return (
        <div className="container">
            <header>
                <h1>오늘 뭐 먹지?</h1>
                <p>결정장애를 위한 스마트 점심 추천기</p>
            </header>

            <section className="filter-section">
                <div className="filter-group">
                    <label>종류</label>
                    <div className="chips">
                        {CUISINES.map((c) => (
                            <FilterChip 
                                key={c.key} 
                                label={c.label} 
                                selected={selectedCuisines.includes(c.key)}
                                onClick={() => toggleCuisine(c.key)}
                            />
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label>가격대</label>
                    <div className="chips">
                        {PRICES.map((p) => (
                            <FilterChip 
                                key={p.key} 
                                label={p.label} 
                                selected={selectedPrices.includes(p.key)}
                                onClick={() => togglePrice(p.key)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="action-section">
                {!hasSearched && !loading && (
                    <button 
                        className="btn-large" 
                        onClick={() => fetchRecommendation(false)}
                    >
                        랜덤 추천 시작 🚀
                    </button>
                )}
            </section>

            <main className="result-section">
                {loading && <div className="loading">두구두구... 🎲</div>}
                
                {!loading && error === 'NO_MATCH' && <EmptyState />}
                
                {!loading && recommendation && <ResultCard />}
            </main>
        </div>
    );
}