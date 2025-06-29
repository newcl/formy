import React, { useState } from 'react';

export const DropZone = ({ onDrop, isLast = false }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => setIsOver(false);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        onDrop(e);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`transition-all duration-200 ${
                isOver 
                    ? 'bg-blue-400 h-16' 
                    : isLast 
                        ? 'h-8 bg-transparent' 
                        : 'h-4 bg-transparent'
            }`}
        />
    );
}; 