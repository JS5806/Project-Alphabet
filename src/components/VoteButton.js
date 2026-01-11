import React from 'react';

const VoteButton = () => {
  const handleClick = () => {
    alert("투표 페이지로 이동합니다!");
  };

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '1.2rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease'
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={handleClick}
      onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
    >
      투표 시작하기
    </button>
  );
};

export default VoteButton;