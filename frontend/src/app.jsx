import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";
import ScoreCpf from "./components/scoreCpf";
import ScoreCnpj from "./components/scoreCnpj";
import EditProfile from "./components/editProfile";
import AdminPanel from "./components/adminPanel";
import Layout from "./components/layout";

import "./styles/style.css";
import "./styles/authentication.css";
import "./styles/score.css";
import "./styles/sidebar.css";
import "./styles/editProfile.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/*  Tela de login */}
        <Route path="/login" element={<Login />} />

        {/*  Rotas internas */}
        <Route element={<Layout />}>
          <Route path="/scoreCpf" element={<ScoreCpf />} />
          <Route path="/scoreCnpj" element={<ScoreCnpj />} />
          <Route path="/register" element={<Register />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
