import React from 'react';
import './SkeletonLoader.css';

/**
 * Skeleton UI for optimized LCP and user perceived performance.
 */
const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-card">
        <div className="skeleton-image pulse"></div>
        <div className="skeleton-text pulse"></div>
        <div className="skeleton-text short pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

// CSS (Extracted for brevity)
// .skeleton-wrapper { display: flex; gap: 1rem; padding: 20px; }
// .skeleton-card { width: 100%; height: 150px; background: #f0f0f0; border-radius: 8px; }
// .pulse { animation: pulse 1.5s infinite ease-in-out; }
// @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }