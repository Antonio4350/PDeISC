import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import LoginModal from "./components/LoginModal.jsx";
import EditButton from "./components/EditButton.jsx";
import EditModal from "./components/EditModal.jsx";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editSection, setEditSection] = useState(null);

  // Contenidos
  const [hero, setHero] = useState("Hola, soy Antonio\nTécnico informático | Desarrollador web | Apasionado por aprender");
  const [about, setAbout] = useState("Soy estudiante de informática con experiencia en proyectos web y redes. Me interesa el desarrollo frontend y backend, y siempre busco aprender nuevas tecnologías.");
  const [skills, setSkills] = useState([
    { nombre: "React", nivel: 80 },
    { nombre: "Tailwind", nivel: 70 },
    { nombre: "Node.js", nivel: 60 },
    { nombre: "MySQL", nivel: 50 },
  ]);
  const [proyectos, setProyectos] = useState([
    { id: 1, titulo: "Portfolio en React", descripcion: "Mi sitio personal con Tailwind." },
    { id: 2, titulo: "API con Node", descripcion: "Backend con Express." },
  ]);

  // Scroll animado
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, []);

  return (
    <div className="bg-gray-900 text-gray-100">
      <Navbar setShowLogin={setShowLogin} isLogged={isLogged} setIsLogged={setIsLogged} />

      <div className="px-6 md:px-12 max-w-7xl mx-auto space-y-16">

        {/* Hero */}
        <section id="inicio" className="min-h-screen flex flex-col items-center justify-center relative">
          <Hero heroText={hero} />
          {isLogged && <EditButton onClick={() => setEditSection("hero")} />}
        </section>

        {/* Sobre mí */}
        <section id="sobre-mi" className="min-h-screen flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <About about={about} />
          {isLogged && <EditButton onClick={() => setEditSection("about")} />}
        </section>

        {/* Habilidades */}
        <section id="habilidades" className="min-h-screen flex flex-col items-center justify-center relative">
          <Skills skills={skills} />
          {isLogged && <EditButton onClick={() => setEditSection("skills")} />}
        </section>

        {/* Proyectos */}
        <section id="proyectos" className="min-h-screen flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <Projects proyectos={proyectos} />
          {isLogged && <EditButton onClick={() => setEditSection("projects")} />}
        </section>

      </div>

      {/* Modales */}
      {showLogin && <LoginModal setShowLogin={setShowLogin} setIsLogged={setIsLogged} />}
      {editSection && (
        <EditModal
          section={editSection}
          setEditSection={setEditSection}
          hero={hero}
          setHero={setHero}
          about={about}
          setAbout={setAbout}
          skills={skills}
          setSkills={setSkills}
          proyectos={proyectos}
          setProyectos={setProyectos}
        />
      )}
    </div>
  );
}
