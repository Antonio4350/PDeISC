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

  // cargar datos desde API
  useEffect(() => {
    async function loadRemote() {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) throw new Error("sin api");
        const data = await res.json();
        setHero(data.portfolio?.hero || "");
        setAbout(data.portfolio?.about || "");
        setSkills(data.skills || []);
        setProyectos(data.projects || []);
      } catch (err) {
        console.warn("Usando estado local:", err.message);
        setHero("Hola, soy Antonio\nTécnico informático | Desarrollador web | Apasionado por aprender");
        setAbout("Soy estudiante de informática con experiencia en proyectos web y redes. Me interesa el desarrollo frontend y backend, y siempre busco aprender nuevas tecnologías.");
        setSkills([
          { nombre: "React", nivel: 80 },
          { nombre: "Tailwind", nivel: 70 },
          { nombre: "Node.js", nivel: 60 },
          { nombre: "MySQL", nivel: 50 },
        ]);
        setProyectos([
          { id: 1, titulo: "Portfolio en React", descripcion: "Mi sitio personal con Tailwind." },
          { id: 2, titulo: "API con Node", descripcion: "Backend con Express." },
        ]);
      }
    }
    loadRemote();
  }, []);

  // scroll suave
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

  async function saveSectionToAPI(sectionName, payload) {
    try {
      if (sectionName === "hero" || sectionName === "about") {
        await fetch("/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero, about }),
        });
      }
      if (sectionName === "skills") {
        await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (sectionName === "projects") {
        for (const p of payload) {
          if (!p.id || p.id < 0) {
            await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
          } else {
            await fetch(`/api/projects/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
          }
        }
      }
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

      {showLogin && <LoginModal setShowLogin={setShowLogin} setIsLogged={setIsLogged} />}
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
