import React, { useState, useCallback, useMemo } from 'react';
import { DraggableField } from './components/DraggableField';
import { BuilderField } from './components/BuilderField';
import { DropZone } from './components/DropZone';
import { PreviewField } from './components/PreviewField';
import { MenuBar } from './components/MenuBar';
import { FIELD_TYPES } from './components/fieldTypes.jsx';

export default function App() {
  const [formSchema, setFormSchema] = useState([]);
  const [previewDevice, setPreviewDevice] = useState('web');
  const [activeTab, setActiveTab] = useState('preview');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [savedForms, setSavedForms] = useState([
    {
      name: 'Contact Form',
      schema: [
        { id: 'text-1', type: 'text', label: 'Full Name', placeholder: 'Enter your full name' },
        { id: 'text-2', type: 'text', label: 'Email', placeholder: 'Enter your email address' },
        { id: 'textarea-1', type: 'textarea', label: 'Message', placeholder: 'Enter your message' }
      ]
    },
    {
      name: 'Registration Form',
      schema: [
        { id: 'text-3', type: 'text', label: 'Username', placeholder: 'Choose a username' },
        { id: 'text-4', type: 'text', label: 'Email', placeholder: 'Enter your email' },
        { id: 'number-1', type: 'number', label: 'Age', placeholder: 'Enter your age' },
        { id: 'date-1', type: 'date', label: 'Birth Date' }
      ]
    }
  ]);
  const [currentFormName, setCurrentFormName] = useState('Untitled Form');

  const handleDropOnZone = useCallback((dropIndex, e) => {
    const fieldType = e.dataTransfer.getData('field-type');
    const draggedIndexStr = e.dataTransfer.getData('dragged-index');
    if (fieldType) {
        if (FIELD_TYPES[fieldType]) {
            const newField = { ...FIELD_TYPES[fieldType].default, id: `${fieldType}-${Date.now()}` };
            const newSchema = [...formSchema];
            newSchema.splice(dropIndex, 0, newField);
            setFormSchema(newSchema);
        }
    } else if (draggedIndexStr) {
        const draggedIndex = parseInt(draggedIndexStr, 10);
        const item = formSchema[draggedIndex];
        const newSchema = [...formSchema];
        newSchema.splice(draggedIndex, 1);
        const newDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newSchema.splice(newDropIndex, 0, item);
        setFormSchema(newSchema);
    }
    setDraggedItemIndex(null);
  }, [formSchema]);

  const handleDragStart = useCallback((index, e) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('dragged-index', index);
  }, []);

  const handleDragEnd = useCallback(() => setDraggedItemIndex(null), []);
  
  const handleCanvasDrop = useCallback((e) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('field-type');
    if (fieldType && FIELD_TYPES[fieldType]) {
      const newField = { ...FIELD_TYPES[fieldType].default, id: `${fieldType}-${Date.now()}` };
      setFormSchema(prev => [...prev, newField]);
    }
  }, []);

  const handleCanvasDragOver = (e) => e.preventDefault();

  const updateField = useCallback((id, updatedField) => {
    setFormSchema(prev => prev.map(f => (f.id === id ? updatedField : f)));
  }, []);

  const removeField = useCallback((id) => {
    setFormSchema(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleJsonChange = (e) => {
    try {
      const newSchema = JSON.parse(e.target.value);
      if (Array.isArray(newSchema)) setFormSchema(newSchema);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  const handleSaveForm = (formName, schema) => {
    const existingIndex = savedForms.findIndex(form => form.name === formName);
    const newForm = { name: formName, schema: schema };
    
    if (existingIndex >= 0) {
      // Update existing form
      const updatedForms = [...savedForms];
      updatedForms[existingIndex] = newForm;
      setSavedForms(updatedForms);
    } else {
      // Add new form
      setSavedForms(prev => [...prev, newForm]);
    }
    
    setCurrentFormName(formName);
  };

  const handleUpdateFormName = (newName) => {
    if (newName.trim() && newName !== currentFormName) {
      // Find the current form and update its name
      const currentFormIndex = savedForms.findIndex(form => form.name === currentFormName);
      if (currentFormIndex >= 0) {
        const updatedForms = [...savedForms];
        updatedForms[currentFormIndex] = {
          ...updatedForms[currentFormIndex],
          name: newName.trim()
        };
        setSavedForms(updatedForms);
        setCurrentFormName(newName.trim());
      }
    }
  };

  const handleCloneForm = () => {
    const baseName = currentFormName || 'Untitled Form';
    let newName = baseName;
    let counter = 1;
    
    // Find a unique name by adding -1, -2, etc.
    while (savedForms.some(form => form.name === newName)) {
      newName = `${baseName}-${counter}`;
      counter++;
    }
    
    const clonedForm = {
      name: newName,
      schema: [...formSchema] // Deep copy the schema
    };
    
    setSavedForms(prev => [...prev, clonedForm]);
    setCurrentFormName(newName);
  };

  const handleNewForm = () => {
    setFormSchema([]);
    setCurrentFormName('Untitled Form');
  };

  const handleFormSelect = (formName) => {
    const selectedForm = savedForms.find(form => form.name === formName);
    if (selectedForm) {
      setFormSchema(selectedForm.schema);
      setCurrentFormName(formName);
    }
  };

  const previewContainerClass = useMemo(() => {
    const base = "h-full p-6 bg-white rounded-lg shadow-inner transition-all duration-300 ease-in-out overflow-y-auto";
    return previewDevice === 'mobile' ? `${base} w-[375px] mx-auto border-4 border-gray-800 rounded-[40px]` : `${base} w-full`;
  }, [previewDevice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Window Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Window Title Bar */}
          <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">Form Builder</span>
            </div>
            <div className="text-xs text-gray-400">
              Form Builder v1.0
            </div>
          </div>

          {/* Menu Bar */}
          <MenuBar 
            savedForms={savedForms}
            currentFormName={currentFormName}
            onFormSelect={handleFormSelect}
            onSaveForm={handleSaveForm}
            onUpdateFormName={handleUpdateFormName}
            onCloneForm={handleCloneForm}
            onNewForm={handleNewForm}
            formSchema={formSchema}
          />
          
          {/* Main Content */}
          <div className="flex h-[calc(100vh-200px)] overflow-hidden">
            <aside className="w-1/4 p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Form Fields</h2>
              {Object.keys(FIELD_TYPES).map(type => <DraggableField key={type} type={type} />)}
            </aside>

            <main className="w-1/2 p-6 overflow-y-auto">
              <div className="bg-white p-6 rounded-xl shadow-md min-h-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Form Builder</h2>
                <div className="builder-canvas" onDrop={handleCanvasDrop} onDragOver={handleCanvasDragOver}>
                  <DropZone onDrop={(e) => handleDropOnZone(0, e)} />
                  {formSchema.length === 0 && draggedItemIndex === null ? (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg pointer-events-none">
                      <p className="text-gray-500">Drop fields here</p>
                    </div>
                  ) : (
                    formSchema.map((field, index) => (
                      <React.Fragment key={field.id}>
                        <BuilderField field={field} onUpdate={updateField} onRemove={removeField} onDragStart={(e) => handleDragStart(index, e)} onDragEnd={handleDragEnd} isDragging={draggedItemIndex === index} />
                        <DropZone onDrop={(e) => handleDropOnZone(index + 1, e)} isLast={index === formSchema.length - 1} />
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            </main>

            <aside className="w-1/4 p-6 bg-gray-50 border-l border-gray-200 flex flex-col">
              <div className="flex-shrink-0 mb-4">
                  <div className="flex border-b">
                      <button onClick={() => setActiveTab('preview')} className={`flex-1 py-2 text-sm font-medium ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Preview</button>
                      <button onClick={() => setActiveTab('json')} className={`flex-1 py-2 text-sm font-medium ${activeTab === 'json' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>JSON</button>
                  </div>
              </div>
              {activeTab === 'preview' ? (
                <div className="flex-grow flex flex-col">
                  <div className="flex-shrink-0 flex justify-center items-center mb-4 space-x-2">
                      <button onClick={() => setPreviewDevice('web')} className={`px-3 py-1 text-sm rounded-md ${previewDevice === 'web' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Web</button>
                      <button onClick={() => setPreviewDevice('mobile')} className={`px-3 py-1 text-sm rounded-md ${previewDevice === 'mobile' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Mobile</button>
                  </div>
                  <div className="flex-grow bg-gray-200 p-4 rounded-xl flex items-center justify-center">
                      <div className={previewContainerClass}>
                          {formSchema.length > 0 ? formSchema.map(field => <PreviewField key={field.id} field={field} />) : <p className="text-center text-gray-500">Preview appears here.</p>}
                      </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">Form Schema (JSON)</h3>
                  <textarea value={JSON.stringify(formSchema, null, 2)} onChange={handleJsonChange} className="w-full flex-grow p-4 border rounded-md font-mono text-sm bg-gray-900 text-green-400" aria-label="Form JSON Schema" />
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
} 