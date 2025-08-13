import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => (
  <section className="NotFound">
    <h3>404 - Pagina no encontrada</h3>
    <p>La pagina que buscas no existe.</p>
    <Link to="/">Volver al inicio</Link>
  </section>
);

export default PageNotFound;