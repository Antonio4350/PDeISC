import { useEffect, useRef } from "react";

export default function Skills({ skills }) {
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.querySelectorAll("[data-fill]").forEach(el => {
            const value = el.getAttribute("data-fill");
            el.style.width = value;
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-4xl w-full" ref={ref}>
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Habilidades</h2>
      <div className="space-y-4">
        {skills.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{s.nombre}</span>
              <span>{s.nivel}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded h-4 overflow-hidden">
              <div
                data-fill={`${s.nivel}%`}
                style={{ width: "0%" , background: "linear-gradient(90deg, green, yellow, orange, red)", height: "100%", borderRadius: 6, transition: "width 800ms ease" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
