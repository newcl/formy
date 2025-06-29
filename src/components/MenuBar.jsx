import React, { useState, useEffect, useRef } from 'react';

export const MenuBar = ({ 
  savedForms, 
  currentFormName, 
  onFormSelect, 
  onSaveForm, 
  onUpdateFormName,
  onCloneForm,
  onNewForm,
  formSchema 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentFormName || 'Untitled Form');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        if (isEditing) {
          handleSave();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    setEditValue(currentFormName || 'Untitled Form');
  }, [currentFormName]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== currentFormName) {
      // Check if this is an existing form or a new one
      const isExistingForm = savedForms.some(form => form.name === currentFormName);
      
      if (isExistingForm) {
        // Update existing form name
        onUpdateFormName(editValue.trim());
      } else {
        // Create new form
        onSaveForm(editValue.trim(), formSchema);
      }
    }
    setIsEditing(false);
  };

  const handleFormSelect = (formName) => {
    onFormSelect(formName);
    setIsDropdownOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(currentFormName || 'Untitled Form');
    }
  };

  const handleDropdownClick = (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      setIsDropdownOpen(false);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  };

  const handleDropdownToggle = () => {
    if (!isEditing) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Form Builder</h1>
          
          {/* Editable Forms Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                className="w-64 px-4 py-2 border border-blue-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter form name..."
              />
            ) : (
              <button
                onClick={handleDropdownToggle}
                className="w-64 flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <span 
                  className="text-sm font-medium text-gray-700 cursor-text truncate flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick(e);
                  }}
                >
                  {currentFormName || 'Untitled Form'}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {isDropdownOpen && !isEditing && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <div className="py-1">
                  {savedForms.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No saved forms</div>
                  ) : (
                    savedForms.map((form, index) => (
                      <button
                        key={index}
                        onClick={() => handleFormSelect(form.name)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
                      >
                        {form.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onNewForm}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            New Form
          </button>
          <button
            onClick={onCloneForm}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Clone
          </button>
          <button
            onClick={handleDropdownClick}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
}; 