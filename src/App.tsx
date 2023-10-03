import React from 'react';
import './App.css';
import Projects from './components/pages/Projects';
import Tasks from './components/pages/Tasks';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Projects/>}/>
          <Route path='/:id' element={<Tasks/>}/>
        </Routes>
      </div>    
    </BrowserRouter>

  );
}

export default App;
