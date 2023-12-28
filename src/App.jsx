import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Juego from "./pages/Juego";

function App() {
  return (
    <div className=" max-w-full max-h-full" >

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:role" element={<Juego />} />
    </Routes>
    </div>
  );
}

export default App;
