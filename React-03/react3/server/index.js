import { connectDB } from "./conectbbdd.js";

export const main = async () => {
    const db = await connectDB();
    if(!db) return;
    const [rows] = await db.execute("SELECT * FROM usr");
    console.log([rows]);
}