import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';


import firebase from 'firebase/compat/app';  // Importa firebase de esta manera para evitar conflictos de versión



const firebaseConfig = {
  apiKey: "AIzaSyAccmkKZAm1BKE-tZUakZIytVuM7Z2DaJk",
  authDomain: "pulsador-f1c0f.firebaseapp.com",
  projectId: "pulsador-f1c0f",
  storageBucket: "pulsador-f1c0f.appspot.com",
  messagingSenderId: "882749688746",
  appId: "1:882749688746:web:b161ab1b223e029b1839d3",
  databaseURL: 'https://pulsador-f1c0f-default-rtdb.europe-west1.firebasedatabase.app//'

};

const app = initializeApp(firebaseConfig);  // Inicializa la aplicación Firebase
function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [botonDesactivado, setBotonDesactivado] = useState(false);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const [nombreBienvenida, setNombreBienvenida] = useState('');
  const [ganadores, setGanadores] = useState([]);
  const [ganador, setGanador] = useState('');



  useEffect(() => {
    const usuariosRef = ref(getDatabase(app), 'usuarios');
    onValue(usuariosRef, (snapshot) => {
      const usuariosData = snapshot.val();
      if (usuariosData) {
        setUsuarios(Object.values(usuariosData));
      }
    });
  }, []);

  const ganadoresRef = ref(getDatabase(app), 'ganadores');

  const agregarUsuario = () => {
    if (nombreUsuario.trim() !== '' && !usuarios.includes(nombreUsuario)) {
      const usuariosRef = ref(getDatabase(app), 'usuarios');
      const nuevoUsuarioRef = push(usuariosRef);
      set(nuevoUsuarioRef, nombreUsuario);
      setNombreUsuario('');
      setMostrarBienvenida(true);
      setNombreBienvenida(nombreUsuario);
    }
  };

  const detectarUsuario = () => {
    if (!botonDesactivado) {
      setBotonDesactivado(true);

      // Agrega el nombre del usuario a la base de datos de ganadores
      const nuevoGanadorRef = push(ganadoresRef);
      set(nuevoGanadorRef, nombreBienvenida);

      // Verifica si hay un solo ganador
      onValue(ganadoresRef, (snapshot) => {
        const ganadoresData = snapshot.val();
        if (ganadoresData) {
          setGanadores(Object.values(ganadoresData));
          if (Object.keys(ganadoresData).length === 1) {
            setGanador(nombreBienvenida);
            iniciarCuentaAtras();
          }
        }
      });
    }
  };

  
  const iniciarCuentaAtras = () => {
    
    // Después de 10 segundos, limpia la base de datos de ganadores y habilita el botón de nuevo
    setTimeout(() => {
      
      setBotonDesactivado(false);
       // Asegúrate de reiniciar a 10 después de limpiar el intervalo
      const ganadoresRef = ref(getDatabase(app), 'ganadores');
      set(ganadoresRef, null);
    }, 10000);
  };
  const reiniciarJuego = () => {
    const usuariosRef = ref(getDatabase(app), 'usuarios');
    const ganadoresRef = ref(getDatabase(app), 'ganadores');
    set(usuariosRef, null); // Borra todos los usuarios de la base de datos
    set(ganadoresRef, null); // Borra los ganadores de la base de datos
    setUsuarios([]);
    setNombreUsuario('');
    setBotonDesactivado(false);
    setMostrarBienvenida(false);
    setNombreBienvenida('');
    setGanadores([]);
    setGanador('');
  };

  return (
    <div className="App">
      <h2>Detección de Usuarios</h2>
      <div>
      {(nombreBienvenida === "Puyod" || nombreBienvenida === "admin") ? (
  <button onClick={reiniciarJuego}>Reiniciar Juego</button>
) : null}      </div>
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
          <button onClick={detectarUsuario} disabled={botonDesactivado}>
            Pulsar
          </button>
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
     
      {botonDesactivado && (
        <div>
        <p>Ganadores:</p>
        <ul>
          {ganadores.map((ganador, index) => (
            <li key={index}>{ganador}</li>
          ))}
        </ul>
      
       
          <p>{ganador} ha ganado</p>

        </div>
      )}
    </div>
  );
}

export default App;