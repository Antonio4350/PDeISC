import { connectDB } from "./conectbbdd.js";

// Listado de usuarios
export async function main() {
  try {
    const conn = await connectDB();
    const [rows] = await conn.query("SELECT * FROM usr");
    await conn.end();
    return rows;
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    return [];
  }
}


// Alta de usuario
export async function agregarUsuario(data) {
  const { nombre, apellido, direccion, telefono, celular, fechaNacimiento, email } = data;
  try {
    const conn = await connectDB();
    const [result] = await conn.query(
      `INSERT INTO usr 
      (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, direccion, telefono, celular, fechaNacimiento, email]
    );
    await conn.end();
    return { id: result.insertId, ...data, fecha_nacimiento: fechaNacimiento };
  } catch (err) {
    console.error("Error al agregar usuario:", err);
    return null;
  }
}

// Modificación de usuario
export async function modificarUsuario(id, data) {
  const { nombre, apellido, direccion, telefono, celular, fechaNacimiento, email } = data;
  try {
    const conn = await connectDB();
    const [result] = await conn.query(
      `UPDATE usr SET 
        nombre = ?, apellido = ?, direccion = ?, telefono = ?, celular = ?, fecha_nacimiento = ?, email = ? 
      WHERE id = ?`,
      [nombre, apellido, direccion, telefono, celular, fechaNacimiento, email, id]
    );
    await conn.end();
    return result.affectedRows > 0 ? { id, ...data, fecha_nacimiento: fechaNacimiento } : null;
  } catch (err) {
    console.error("Error al modificar usuario:", err);
    return null;
  }
}

// Baja de usuario
export async function eliminarUsuario(id) {
  try {
    const conn = await connectDB();
    const [result] = await conn.query("DELETE FROM usr WHERE id = ?", [id]);
    await conn.end();
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    return false;
  }
}