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

  const [hero, setHero] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  // 🔹 Función para cargar datos desde la BBDD
  async function loadRemote() {
    try {
      const res = await fetch("http://localhost:3000/api/portfolio");
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

  // 🔹 Cargar datos al montar el componente si ya está logueado
  useEffect(() => {
    if (isLogged) loadRemote();
  }, [isLogged]);

  // 🔹 Scroll suave
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }, []);

  // 🔹 Guardar cambios en la BBDD
  async function saveSectionToAPI(sectionName, payload) {
    try {
      if (sectionName === "hero") {
        await fetch("http://localhost:3000/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero: payload }),
        });
      } else if (sectionName === "about") {
        await fetch("http://localhost:3000/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ about: payload }),
        });
      } else if (sectionName === "skills") {
        await fetch("http://localhost:3000/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (sectionName === "projects") {
        for (const p of payload) {
          if (!p.id || p.id < 0) {
            await fetch("http://localhost:3000/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(p),
            });
          } else {
            await fetch(`http://localhost:3000/api/projects/${p.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(p),
            });
          }
        }
      }

      // 🔹 Recargar los datos para mantener consistencia
      await loadRemote();

    } catch (err) {
      console.warn("No se pudo guardar:", err.message);
    }
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar setShowLogin={setShowLogin} isLogged={isLogged} setIsLogged={setIsLogged} />

      <div className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <section id="inicio" className="min-h-screen flex flex-col items-center justify-center relative">
          <Hero heroText={hero} />
          {isLogged && <EditButton onClick={() => setEditSection("hero")} />}
        </section>

        <section id="sobre-mi" className="min-h-screen flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <About about={about} />
          {isLogged && <EditButton onClick={() => setEditSection("about")} />}
        </section>

        <section id="habilidades" className="min-h-screen flex flex-col items-center justify-center relative">
          <Skills skills={skills} />
          {isLogged && <EditButton onClick={() => setEditSection("skills")} />}
        </section>

        <section id="proyectos" className="min-h-screen flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 relative">
          <Projects proyectos={proyectos} />
          {isLogged && <EditButton onClick={() => setEditSection("projects")} />}
        </section>
      </div>

      {/* Login solo si no está logueado */}
      {!isLogged && showLogin && (
        <LoginModal
          setShowLogin={setShowLogin}
          setIsLogged={async (val) => {
            setIsLogged(val);
            setShowLogin(false);
            if (val) await loadRemote(); // 🔹 recargar datos al loguear
          }}
        />
      )}

      {/* Editar sección */}
      {editSection && (
        <EditModal
          section={editSection}
          setEditSection={setEditSection}
          hero={hero}
          setHero={(v) => { setHero(v); saveSectionToAPI("hero", v); }}
          about={about}
          setAbout={(v) => { setAbout(v); saveSectionToAPI("about", v); }}
          skills={skills}
          setSkills={(v) => { setSkills(v); saveSectionToAPI("skills", v); }}
          proyectos={proyectos}
          setProyectos={(v) => { setProyectos(v); saveSectionToAPI("projects", v); }}
        />
      )}
    </div>
  );
}
