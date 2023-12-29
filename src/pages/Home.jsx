import React from "react";
import { Button, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
export default function Home() {

    const navigate = useNavigate();

  return (
    < >
      <div className="flex flex-col gap-5 text-white" >
      <h1 className="text-center text-6xl	">ELIGE ROL</h1>
        <Button className="mt-10 bg-gradient-to-tr from-red-400 to-red-500 text-white shadow-lg hover:focus:before:selection" variant="shadow" style={{width:"380px", height:"150px", fontSize:"2rem"}} as={Link} onClick={() => navigate('/game/admin')} color="danger">PRESENTADOR/A</Button>
      

      
        <Button className="bg-gradient-to-tr from-green-500 to-blue-500 text-white shadow-lg" variant="full" style={{width:"380px", height:"150px", fontSize:"2rem"}} as={Link} onClick={() => navigate("/game/concursante")} color="success">CONCURSANTE</Button>

      </div>
     
    </>
  );
}
