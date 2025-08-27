import { Routes, Route, Link } from 'react-router-dom';
import Lista from './components/Lista.jsx';
import Agregar from './components/Agregar.jsx';
import Editar from './components/Editar.jsx';
import Consulta from './components/Consulta.jsx';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-blue-700 shadow-lg">
        <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between p-6">
          <h1 className="text-white font-bold text-2xl mb-4 md:mb-0">Gestión de Usuarios</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/" className="text-white hover:text-blue-200 font-semibold text-lg transition-colors">Lista</Link>
            <Link to="/agregar" className="text-white hover:text-blue-200 font-semibold text-lg transition-colors">Agregar</Link>
          </div>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<Lista />} />
          <Route path="/agregar" element={<Agregar />} />
          <Route path="/editar/:id" element={<Editar />} />
          <Route path="/consulta/:id" element={<Consulta />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
