import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
