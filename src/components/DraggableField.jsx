import React from 'react';
import { FIELD_TYPES } from './fieldTypes.jsx';

export const DraggableField = ({ type }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('field-type', type);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm cursor-grab border border-gray-200 hover:shadow-md hover:border-blue-500 transition-all"
    >
      <div className="text-gray-500 mr-4">{FIELD_TYPES[type].icon}</div>
      <span className="font-medium text-gray-700">{FIELD_TYPES[type].label}</span>
    </div>
  );
}; 