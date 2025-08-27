export async function leerUrl(url) {
    try {
        const response = await fetch(url);

        //si la respuesta no es correcta lanza un error
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        //devuelve los datos como json
        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
}