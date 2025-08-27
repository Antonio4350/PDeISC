import { Routes, Route, Link } from 'react-router-dom';
import Lista from './components/lista.jsx';
import Creacion from './components/agregar.jsx';
import Detalle from './components/edicion.jsx';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 shadow-md">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="flex gap-6">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Inicio</Link>
            <Link to="/creacion" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Agregar Usuario</Link>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Lista />} />
        <Route path="/creacion" element={<Creacion />} />
        <Route path="/detalle/:id" element={<Detalle />} />
      </Routes>
    </div>
  );
}

export default App;
