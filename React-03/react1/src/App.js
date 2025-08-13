import Saludo from "./componentes/holaMundo";
import Tarjeta from "./componentes/tarjeta";
import Contador from "./componentes/contador";
import ListaTareas from "./componentes/tareas";
import FormularioSimple from "./componentes/formulario";

function App() {
  return (
    <div className="App">
      <header className="App-header"> 
        <Saludo />
        <br />
        <Tarjeta
        img = '/logo192.png'
        name = 'Juan'
        surname = 'no se'
        profesions = 'Cartonero'
        />
        <br />
        <Contador />
        <br />
        <ListaTareas />
        <br />
        <FormularioSimple />
        <br />
      </header>
    </div>
  );
}

export default App;
