import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  Button,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Link,
  Input,
} from "@nextui-org/react";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, off } from "firebase/database";
import icon from "../assets/icon.gif";

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
  const navigate = useNavigate();

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
    <div className="flex flex-col items-center gap-10 px-4">
      <div>
          <Button as={Link} onClick={() => navigate("/")} color="success" className="flex mb-2 text-white">
            VOLVER A INICIO
          </Button>
        
        
        {params.role === "admin" ? (
          <div className="flex gap-10">
            <Button onClick={reiniciarJuego} color="danger">
              REINICIAR JUEGO
            </Button>
            <Button onClick={borrarGanadores} color="primary">
              BORRAR WINNERS
            </Button>
          </div>
        ) : null}{" "}
      </div>
      <div className=" mr-6 w-64 ">
      <Table
  aria-label="Example static collection table"
  className="text-black"
  color="secondary"
  style={{ columnCount: window.innerHeight > 200 ? 2 : 1 }}
>
  <TableHeader>
    <TableColumn className="flex flex-row items-center gap-1">
      <Avatar src={icon} /> USUARIOS ONLINE <></>
      
    </TableColumn>
    
  </TableHeader>
  <TableBody>
    {usuarios.map((usuario, index) => (
      <TableRow key={index}>
        <TableCell className="flex gap-2" key={index}>
        <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#25333a"
                      d="M.002 31.803L31.984-.18l31.982 31.982l-31.982 31.982z"
                    ></path>
                    <path
                      fill="#724198"
                      d="M60.51 28.355a4.874 4.874 0 0 1 0 6.895L35.42 60.34a4.876 4.876 0 0 1-6.894 0L3.436 35.25a4.875 4.875 0 0 1 0-6.892l25.09-25.09a4.873 4.873 0 0 1 6.893 0l25.09 25.09"
                    ></path>
                    <path
                      fill="#0867a3"
                      d="m24.351 56.16l4.182 4.182a4.876 4.876 0 0 0 6.894 0l25.09-25.09a4.874 4.874 0 0 0 0-6.895l-25.09-25.09c14.376 25.297-4 46.19-11.08 52.887"
                    ></path>
                    <path
                      fill="#439dd7"
                      d="M54.741 32.518L31.98 54.923L9.219 32.518L31.981 10.11z"
                    ></path>
                    <path
                      fill="#fff"
                      d="m38.59 32.518l-6.609 6.502l-6.608-6.502l6.608-6.508z"
                    ></path>
                    <path
                      fill="#8dcbef"
                      d="M31.981 10.11L21.706 32.518L31.98 54.923L9.219 32.518z"
                    ></path>
                  </svg>{" "}
          {usuario}
          
        </TableCell>
      </TableRow>
    ))}
    
  </TableBody>
  
</Table>
       
        <ul></ul>
      </div>
      {mostrarBienvenida && (
        <div className="flex flex-col gap-3 items-center">
          <p className="text-2xl">¡Bienvenido {nombreBienvenida}!</p>
          <Button
            onClick={detectarUsuario}
            disabled={ganadores.length > 2 || tiempoDeEspera}
            className="redondo text-3xl"
            color="danger"
            
          >
           
            Pulsar
          </Button>
          {ganadores.length>0 &&<div className="text-2xl">
          <p>Ganadores</p>
          <ol>
            {ganadores.map((ganador, index) => (
              <li key={index}><b>{index+1}º</b> {ganador}</li>
            ))}
          </ol>

          </div>}
          
        </div>
      )}
      {!mostrarBienvenida && (
        <div className="flex gap-2 text-white flex-col">
          <Input
            type="text"
            className="text-black border-r-emerald-300 "
            style={{ fontSize:"20px" , textAlign:"center"}}
            placeholder="Ingresa tu nombre"
            value={nombreUsuario}
            color="secondary"
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
          <Button
            className="text-white"
            variant="bordered"
            onClick={agregarUsuario}
            style={{ fontSize:"20px" , textAlign:"center", height:"50px"}}
          >
            Agregar Usuario
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
