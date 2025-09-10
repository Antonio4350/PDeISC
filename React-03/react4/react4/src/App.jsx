import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import LoginModal from "./components/LoginModal.jsx";
import EditModal from "./components/EditModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true); // nuevo

  const [hero, setHero] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  async function loadRemote() {
    setLoading(true); // mostrar loader
    try {
      const [resHero, resAbout, resSkills, resProyectos] = await Promise.all([
        fetch(`${API_URL}/api/hero`),
        fetch(`${API_URL}/api/about`),
        fetch(`${API_URL}/api/skills`),
        fetch(`${API_URL}/api/projects`)
      ]);

      const heroData = await resHero.json();
      const aboutData = await resAbout.json();
      const skillsData = await resSkills.json();
      const proyectosData = await resProyectos.json();

      setHero(heroData.hero || "");
      setAbout(aboutData.about || "");
      setSkills(skillsData.skills || []);
      setProyectos(proyectosData.projects || []);
    } catch (err) {
      console.error("Error cargando datos:", err.message);
    } finally {
      setLoading(false); // ocultar loader
    }
  }

  useEffect(() => { loadRemote(); }, []);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen relative">

      {/* Loader pantalla completa */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">Cargando datos...</div>
        </div>
      )}

      <Navbar setShowLogin={setShowLogin} isLogged={isLogged} setIsLogged={setIsLogged} toggleEdit={() => setEditOpen(true)} />

      <div className="px-4 sm:px-6 pt-20 pb-10 md:px-12 max-w-7xl mx-auto space-y-8">

        <section id="inicio" className="py-12 flex flex-col items-center justify-center text-center bg-gray-800 rounded-lg p-4 md:p-6">
          {hero ? <Hero heroText={hero} /> : <p className="text-gray-400 italic text-lg">Aún no hay información cargada.</p>}
        </section>

        <section id="sobre-mi" className="py-12 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 md:p-6">
          <About about={about} />
        </section>

        <section id="habilidades" className="py-12 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 md:p-6">
          <Skills skills={skills} />
        </section>

        <section id="proyectos" className="py-12 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 md:p-6">
          <Projects proyectos={proyectos} isLogged={isLogged} deleteProject={(id) => setProyectos(proyectos.filter(p => p.id !== id))} />
        </section>
      </div>

      {!isLogged && showLogin && (
        <LoginModal
          setShowLogin={setShowLogin}
          setIsLogged={val => { setIsLogged(val); setShowLogin(false); if(val) loadRemote(); }}
        />
      )}

      {isLogged && editOpen && (
        <EditModal
          setEditSection={setEditOpen}
          hero={hero} setHero={setHero}
          about={about} setAbout={setAbout}
          skills={skills} setSkills={setSkills}
          proyectos={proyectos} setProyectos={setProyectos}
        />
      )}
    </div>
  );
}
