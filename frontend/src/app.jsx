import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";
import Score from "./components/score";

import "./styles/style.css";
import "./styles/authentication.css";
import "./styles/score.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </Router>
  );
};

export default App;
