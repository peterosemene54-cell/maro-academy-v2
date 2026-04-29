import React, { useState } from 'react';
import Register from './Register';
import Admin from './Admin';

function App() {
  // This "State" remembers which page we are looking at
  const [view, setView] = useState('register');

  return (
    <div className="App">
      {/* Navigation Buttons (The Switch) */}
      <nav style={{ padding: '10px', background: '#333', textAlign: 'center' }}>
        <button 
          onClick={() => setView('register')} 
          style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}>
          Student Registration
        </button>
        <button 
          onClick={() => setView('admin')} 
          style={{ padding: '10px', cursor: 'pointer', background: 'gold', fontWeight: 'bold' }}>
          Oga's Admin Panel 💰
        </button>
      </nav>

      {/* Logic to show the page */}
      <hr />
      {view === 'register' ? <Register /> : <Admin />}
    </div>
  );
}

export default App;
