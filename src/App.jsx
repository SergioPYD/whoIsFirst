import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Juego from "./pages/Juego";

function App() {
  return (
    <div className="git pr-6 flex justify-center pt-10" style={{ height:"100vh"}} >

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:role" element={<Juego />} />
    </Routes>
    </div>
  );
}

export default App;
