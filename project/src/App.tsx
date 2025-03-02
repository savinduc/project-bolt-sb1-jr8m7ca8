import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setIsEditing(true);
  };
  
  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    setActiveNote(updatedNote);
    setIsEditing(false);
  };
  
  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    
    if (activeNote && activeNote.id === id) {
      setActiveNote(filteredNotes.length > 0 ? filteredNotes[0] : null);
      setIsEditing(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold">Notes</h1>
          <button 
            onClick={createNewNote}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Create new note"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notes yet. Create one!
            </div>
          ) : (
            <ul>
              {notes.map(note => (
                <li 
                  key={note.id}
                  className={`border-b border-gray-200 cursor-pointer ${
                    activeNote && activeNote.id === note.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setActiveNote(note);
                    setIsEditing(false);
                  }}
                >
                  <div className="p-3 hover:bg-gray-50">
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-sm text-gray-500 flex justify-between items-center">
                      <span>{formatDate(note.createdAt)}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500"
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                  className="text-xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  autoFocus
                />
              ) : (
                <h2 className="text-xl font-bold">{activeNote.title}</h2>
              )}
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => updateNote(activeNote)}
                      className="p-2 rounded-full hover:bg-gray-100 text-green-600"
                      title="Save changes"
                    >
                      <Save size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        setActiveNote(notes.find(note => note.id === activeNote.id) || null);
                        setIsEditing(false);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                      title="Cancel editing"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 flex-grow overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => setActiveNote({...activeNote, content: e.target.value})}
                  className="w-full h-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Write your note here..."
                />
              ) : (
                <div className="whitespace-pre-wrap">
                  {activeNote.content || (
                    <span className="text-gray-400">No content. Click Edit to add some.</span>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="mb-4">Select a note or create a new one</p>
              <button 
                onClick={createNewNote}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center mx-auto"
              >
                <Plus size={20} className="mr-2" /> Create New Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;