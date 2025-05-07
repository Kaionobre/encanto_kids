import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VisaoGeral } from "./pages/VisaoGeral"; 
import PainelAdministrativo from "./pages/PainelAdministrativo";
import FormCrianca from "./pages/FormCrianca";
import Financeiro from "./pages/Financeiro"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/visaogeral" element={<VisaoGeral />} />
        <Route path="/painel-administrativo" element={<PainelAdministrativo />} />
        <Route path="/cadastrar-crianca" element={<FormCrianca />} />
        <Route path="/financeiro" element={<Financeiro />} />
      </Routes>
    </Router>
  );
}

export default App;
