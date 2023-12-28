import React, { useState, useEffect } from "react";
import { NavLink, useParams} from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, off } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL:
      "https://pulsador-f1c0f-default-rtdb.europe-west1.firebasedatabase.app",
  };
  
  const app = initializeApp(firebaseConfig); // Inicializa la aplicación Firebase
  function App() {

    const params = useParams();

    

    const [usuarios, setUsuarios] = useState([]);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [botonDesactivado, setBotonDesactivado] = useState(false);
    const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
    const [nombreBienvenida, setNombreBienvenida] = useState("");
    const [ganadores, setGanadores] = useState([]);
    const [ganador, setGanador] = useState("");
    const [tiempoDeEspera, setTiempoDeEspera] = useState(false);
  
    useEffect(() => {
        
      const usuariosRef = ref(getDatabase(app), "usuarios");
      onValue(usuariosRef, (snapshot) => {
        const usuariosData = snapshot.val();
        if (usuariosData) {
          setUsuarios(Object.values(usuariosData));
        }
      });
    }, []);
  
    useEffect(() => {
      const ganadoresRef = ref(getDatabase(app), "ganadores");
  
      // Función que se ejecuta cada vez que hay un cambio en la base de datos 'ganadores'
      const handleGanadoresChange = (snapshot) => {
        const ganadoresData = snapshot.val();
        const ganadoresArray = ganadoresData ? Object.values(ganadoresData) : [];
  
        // Actualiza el estado local independientemente de si ganadoresData está vacío o no
        setGanadores(ganadoresArray);
      };
  
      // Establece la escucha continua en la base de datos 'ganadores'
      const ganadoresListener = onValue(ganadoresRef, handleGanadoresChange);
  
      // Devuelve una función de limpieza para detener la escucha cuando el componente se desmonta
      return () => {
        off(ganadoresRef, "value", ganadoresListener);
      };
    }, []); // El array de dependencias está vacío, por lo que este useEffect se ejecuta solo una vez
  
    const ganadoresRef = ref(getDatabase(app), "ganadores");
  
    const agregarUsuario = () => {
      if (nombreUsuario.trim() !== "" && !usuarios.includes(nombreUsuario)) {
        const usuariosRef = ref(getDatabase(app), "usuarios");
        const nuevoUsuarioRef = push(usuariosRef);
        set(nuevoUsuarioRef, nombreUsuario);
        setNombreUsuario("");
        setMostrarBienvenida(true);
        setNombreBienvenida(nombreUsuario);
      }
    };
  
    const detectarUsuario = () => {
      // Desactiva el botón y configura el tiempo de espera
      setBotonDesactivado(true);
      setTiempoDeEspera(true);
  
      // Agrega el nombre del usuario a la base de datos de ganadores
      const nuevoGanadorRef = push(ganadoresRef);
      set(nuevoGanadorRef, nombreBienvenida);
  
      // Después de 3 segundos, restablece el estado
      setTimeout(() => {
        setBotonDesactivado(false);
        setTiempoDeEspera(false);
      }, 3000);
    };
  
    const borrarGanadores = () => {
      // Después de 10 segundos, limpia la base de datos de ganadores y habilita el botón de nuevo
  
      // Asegúrate de reiniciar a 10 después de limpiar el intervalo
      const ganadoresRef = ref(getDatabase(app), "ganadores");
      set(ganadoresRef, null);
      setGanadores([]);
    };
    const reiniciarJuego = () => {
      const usuariosRef = ref(getDatabase(app), "usuarios");
      const ganadoresRef = ref(getDatabase(app), "ganadores");
      set(usuariosRef, null); // Borra todos los usuarios de la base de datos
      set(ganadoresRef, null); // Borra los ganadores de la base de datos
      setUsuarios([]);
      setNombreUsuario("");
      setBotonDesactivado(false);
      setMostrarBienvenida(false);
      setNombreBienvenida("");
      setGanadores([]);
      setGanador("");
    };
  
    return (
      <div className="App">
        
        <div>
          {params.role === "admin" ? (
            <div>
              <button onClick={reiniciarJuego}>Reiniciar Juego</button>
              <button onClick={borrarGanadores}>Borrar Ganadores</button>
            </div>
          ) : null}{" "}
        </div>
        <div>
          <p>Usuarios Actuales:</p>
          <ul>
            {usuarios.map((usuario, index) => (
              <li key={index}>{usuario}</li>
            ))}
          </ul>
        </div>
        {mostrarBienvenida && (
          <div>
            <p>Bienvenido, {nombreBienvenida}!</p>
            <button
              onClick={detectarUsuario}
              disabled={ganadores.length > 2 || tiempoDeEspera}
            >
              Pulsar
            </button>
            <p>Ganadores:</p>
            <ol>
              {ganadores.map((ganador, index) => (
                <li key={index}>{ganador}</li>
              ))}
            </ol>
          </div>
        )}
        {!mostrarBienvenida && (
          <div>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <button onClick={agregarUsuario}>Agregar Usuario</button>
          </div>
        )}
  
            <NavLink to="/"><button>VOLVER A INICIO</button></NavLink>
      </div>
    );
  }
  
  export default App;
  