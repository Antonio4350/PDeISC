import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import LoginModal from "./components/LoginModal.jsx";
import EditButton from "./components/EditButton.jsx";
import EditModal from "./components/EditModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editSection, setEditSection] = useState(null);

  const [hero, setHero] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  async function loadRemote() {
    try {
      const res = await fetch(`${API_URL}/api/portfolio`);
      if (!res.ok) throw new Error("Error al cargar datos de la API");
      const data = await res.json();
      setHero(data.portfolio?.hero || "");
      setAbout(data.portfolio?.about || "");
      setSkills(data.skills || []);
      setProyectos(data.projects || []);
    } catch (err) {
      console.error("Error al cargar datos desde BBDD:", err.message);
    }
  }

  useEffect(() => {
    loadRemote();
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, []);

  async function saveSectionToAPI(sectionName, payload) {
    try {
      if (sectionName === "hero" || sectionName === "about") {
        await fetch(`${API_URL}/api/portfolio`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero, about }),
        });
      } else if (sectionName === "skills") {
        await fetch(`${API_URL}/api/skills`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (sectionName === "projects") {
        for (const p of payload) {
          if (!p.id || p.id < 0) {
            await fetch(`${API_URL}/api/projects`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ titulo: p.titulo, descripcion: p.descripcion }),
            });
          } else {
            await fetch(`${API_URL}/api/projects/${p.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(p),
            });
          }
        }
      }
    } catch (err) {
      console.warn("No se pudo guardar:", err.message);
    }
  }

  async function deleteProject(id) {
    try {
      await fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" });
      setProyectos((prev) => prev.filter((p) => p.id !== id));
      await loadRemote();
    } catch (err) {
      console.error("No se pudo eliminar el proyecto:", err.message);
    }
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar setShowLogin={setShowLogin} isLogged={isLogged} setIsLogged={setIsLogged} />

      <div className="px-4 sm:px-6 pt-20 pb-10 md:px-12 max-w-7xl mx-auto space-y-12">
        <section id="inicio" className="py-16 flex flex-col items-center h-75 justify-center text-center bg-gray-800 rounded-lg p-6 relative">
          {hero ? <Hero heroText={hero} /> : <p className="text-gray-400 italic text-xl">Aún no hay información cargada en la sección de inicio.</p>}
          {isLogged && <EditButton onClick={() => setEditSection("hero")} />}
        </section>

        <section id="sobre-mi" className="py-28 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <About about={about} />
          {isLogged && <EditButton onClick={() => setEditSection("about")} />}
        </section>

        <section id="habilidades" className="py-28 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <Skills skills={skills} />
          {isLogged && <EditButton onClick={() => setEditSection("skills")} />}
        </section>

        <section id="proyectos" className="py-28 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <Projects proyectos={proyectos} deleteProject={deleteProject} isLogged={isLogged} />
          {isLogged && <EditButton onClick={() => setEditSection("projects")} />}
        </section>
      </div>

      {!isLogged && showLogin && <LoginModal setShowLogin={setShowLogin} setIsLogged={async (val) => { setIsLogged(val); setShowLogin(false); if (val) await loadRemote(); }} />}

      {editSection && (
        <EditModal
          section={editSection}
          setEditSection={setEditSection}
          hero={hero} setHero={(v) => { setHero(v); saveSectionToAPI("hero", v); }}
          about={about} setAbout={(v) => { setAbout(v); saveSectionToAPI("about", v); }}
          skills={skills} setSkills={(v) => { setSkills(v); saveSectionToAPI("skills", v); }}
          proyectos={proyectos} setProyectos={(v) => { setProyectos(v); saveSectionToAPI("projects", v); }}
        />
      )}
    </div>
  );
}
