import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatLichKham from './components/DatLichKham';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route path="/DatLichKham" element={<DatLichKham />} />
        </Route>

        {/* Add more routes if needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
