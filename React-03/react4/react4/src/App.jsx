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

  const [hero, setHero] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  async function loadRemote() {
    try {
      const resHero = await fetch(`${API_URL}/api/hero`);
      const heroData = await resHero.json();
      setHero(heroData.hero || "");

      const resAbout = await fetch(`${API_URL}/api/about`);
      const aboutData = await resAbout.json();
      setAbout(aboutData.about || "");

      const resSkills = await fetch(`${API_URL}/api/skills`);
      const skillsData = await resSkills.json();
      setSkills(skillsData.skills || []);

      const resProyectos = await fetch(`${API_URL}/api/projects`);
      const proyectosData = await resProyectos.json();
      setProyectos(proyectosData.projects || []);
    } catch (err) {
      console.error("Error cargando datos:", err.message);
    }
  }

  useEffect(() => { loadRemote(); }, []);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar setShowLogin={setShowLogin} isLogged={isLogged} setIsLogged={setIsLogged} toggleEdit={() => setEditOpen(true)} />

      <div className="px-4 sm:px-6 pt-20 pb-10 md:px-12 max-w-7xl mx-auto space-y-12">
        <section id="inicio" className="py-16 flex flex-col items-center h-75 justify-center text-center bg-gray-800 rounded-lg p-6 relative">
          {hero ? <Hero heroText={hero} /> : <p className="text-gray-400 italic text-xl">Aún no hay información cargada.</p>}
        </section>

        <section id="sobre-mi" className="py-28 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <About about={about} />
        </section>

        <section id="habilidades" className="py-28 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <Skills skills={skills} />
        </section>

        <section id="proyectos" className="py-28 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <Projects proyectos={proyectos} isLogged={isLogged} deleteProject={(id) => setProyectos(proyectos.filter(p => p.id !== id))} />
        </section>
      </div>

      {!isLogged && showLogin && <LoginModal setShowLogin={setShowLogin} setIsLogged={val => { setIsLogged(val); setShowLogin(false); if(val) loadRemote(); }} />}

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
