import { useState } from "react";

function Contador(){
    const [getNumero, setNumero]=useState(0);

    function incrementa(){setNumero(getNumero +1);}
    function decrementar(){setNumero(getNumero -1);}

    return (
        <div className="flex justify-center mt-6">
            <table className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white">
                <tr className="bg-gray-100">
                    <td colSpan="2" className="text-center p-6">
                        <h1 className="text-6xl font-bold text-indigo-600">{getNumero}</h1>
                    </td>
                </tr>
                <tr>
                    <td className="p-4 text-center">
                        <button onClick={decrementar} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"> Restar</button>
                    </td>
                    <td className="p-4 text-center">
                        <button onClick={incrementa} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">Sumar</button>
                    </td>
                </tr>
            </table>
        </div>
    );
    
}
export default Contador