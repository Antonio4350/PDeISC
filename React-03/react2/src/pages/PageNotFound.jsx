import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => (
  <section className="NotFound">
    <h3>404 - Página no encontrada</h3>
    <p>La página que buscas no existe.</p>
    <Link to="/">Volver al inicio</Link>
  </section>
);

export default PageNotFound;