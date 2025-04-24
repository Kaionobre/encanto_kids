import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { VisaoGeral } from "./pages/VisaoGeral"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/visaogeral" element={<VisaoGeral />} />
      </Routes>
    </Router>
  );
}

export default App;
