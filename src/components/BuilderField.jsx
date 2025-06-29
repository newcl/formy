import React from 'react';
import { TrashIcon } from './icons';

export const BuilderField = ({ field, onUpdate, onRemove, onDragStart, onDragEnd, isDragging }) => {
  const handleChange = (prop) => (e) => {
    onUpdate(field.id, { ...field, [prop]: e.target.value });
  };

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`p-4 mb-2 bg-gray-50 rounded-lg border border-gray-300 relative group cursor-move transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
       <button onClick={() => onRemove(field.id)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove field">
        <TrashIcon />
      </button>
      <div className="mb-2">
        <label className="block text-sm font-bold text-gray-700 mb-1">Label</label>
        <input type="text" value={field.label} onChange={handleChange('label')} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      {field.hasOwnProperty('placeholder') && (
         <div className="mb-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Placeholder</label>
          <input type="text" value={field.placeholder} onChange={handleChange('placeholder')} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">Type: {field.type}</p>
    </div>
  );
}; 