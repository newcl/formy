import React from 'react';

export const PreviewField = ({ field }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea placeholder={field.placeholder} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" rows="4" readOnly />
      ) : (
        <input type={field.type} placeholder={field.placeholder} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" readOnly />
      )}
    </div>
  );
}; 