// api/cors.js
export default function withCors(handler) {
  return async (req, res) => {
    // Permitir solo tu frontend
    res.setHeader("Access-Control-Allow-Origin", "https://p-de-isc-peach.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Responder preflight
    if (req.method === "OPTIONS") return res.status(200).end();

    return handler(req, res);
  };
}
