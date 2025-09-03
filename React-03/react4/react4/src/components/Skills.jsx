import { useEffect, useRef } from "react";

export default function Skills({ skills }) {
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.querySelectorAll("[data-fill]").forEach((el) => {
              const value = el.getAttribute("data-fill");
              el.style.width = value;
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [skills]);

  return (
    <div className="max-w-4xl w-full" ref={ref}>
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">
        Habilidades
      </h2>
      <div className="space-y-6">
        {skills.map((s, i) => (
          <div key={i} className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>{s.nombre}</span>
              <span>{s.nivel}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded h-4 overflow-hidden">
              <div
                data-fill={`${s.nivel}%`}
                style={{
                  width: "0%",
                  transition: "width 0.8s ease-in-out",
                  background: "linear-gradient(90deg, #22c55e, #eab308, #f97316, #dc2626)",
                }}
                className="h-4 rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
