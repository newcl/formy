import React, { useState } from 'react';

export const DropZone = ({ onDrop }) => {
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
            className={`h-2 my-1 transition-all duration-200 ${isOver ? 'bg-blue-400 h-12' : 'bg-transparent'}`}
        />
    );
}; 