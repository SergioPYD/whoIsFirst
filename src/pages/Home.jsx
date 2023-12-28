import React from "react";
import { Button, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
export default function Home() {

    const navigate = useNavigate();

  return (
    < >
      <div className="flex flex-col gap-5">
      <h1>ELIGE ROL</h1>
        <Button style={{width:"380px", height:"150px", fontSize:"2rem"}} as={Link} onClick={() => navigate('/game/admin')} color="danger">PRESENTADOR/A</Button>
      

      
        <Button style={{width:"380px", height:"150px", fontSize:"2rem"}} as={Link} onClick={() => navigate("/game/concursante")} color="success">CONCURSANTE</Button>

      </div>
     
    </>
  );
}
