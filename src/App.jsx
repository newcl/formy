import React, { useState, useCallback, useMemo } from 'react';
import { DraggableField } from './components/DraggableField';
import { BuilderField } from './components/BuilderField';
import { DropZone } from './components/DropZone';
import { PreviewField } from './components/PreviewField';
import { FIELD_TYPES } from './components/fieldTypes.jsx';

export default function App() {
  const [formSchema, setFormSchema] = useState([]);
  const [previewDevice, setPreviewDevice] = useState('web');
  const [activeTab, setActiveTab] = useState('preview');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

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

  const previewContainerClass = useMemo(() => {
    const base = "h-full p-6 bg-white rounded-lg shadow-inner transition-all duration-300 ease-in-out overflow-y-auto";
    return previewDevice === 'mobile' ? `${base} w-[375px] mx-auto border-4 border-gray-800 rounded-[40px]` : `${base} w-full`;
  }, [previewDevice]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
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
                  <DropZone onDrop={(e) => handleDropOnZone(index + 1, e)} />
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
  );
} 