function Tarjeta(datos){
return (
    <div className="flex justify-center mt-6">
      <table className="border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <tr className="bg-gray-100">
          <td colSpan="2" className="text-center p-4">
            <img
              src={datos.img}
              alt={`${datos.name} ${datos.surname}`}
              className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-indigo-500"
            />
          </td>
        </tr>
        <tr>
          <td className="p-2 font-semibold bg-gray-50">Nombre:</td>
          <td className="p-2">{datos.name}</td>
        </tr>
        <tr>
          <td className="p-2 font-semibold bg-gray-50">Apellido:</td>
          <td className="p-2">{datos.surname}</td>
        </tr>
        <tr>
          <td className="p-2 font-semibold bg-gray-50">Profesión:</td>
          <td className="p-2">{datos.profesions}</td>
        </tr>
      </table>
    </div>
  );
}
export default Tarjeta