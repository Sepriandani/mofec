import * as React from "react";
import { Routes, Route} from "react-router-dom";
import About from "./pages/About";
import Kurva from "./pages/Kurva";
import Login from "./pages/Login";
import Pengukuran from "./pages/Pengukuran";
import Register from "./pages/Register";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  return (
        <Routes>
          <Route exact element={<PrivateRoutes/>} >
            <Route exact path="/" element={<Pengukuran />} />
            <Route exact path="/kurva" element={<Kurva />} />
            <Route exact path="/about" element={<About />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
  );
}

export default App;
