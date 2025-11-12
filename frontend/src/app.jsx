import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from  "./contexts/userContext";

import Login from "./components/login";
import Register from "./components/register";
import ScoreCpf from "./components/scoreCpf";
import ScoreCnpj from "./components/scoreCnpj";
import EditProfile from "./components/editProfile";
import AdminPanel from "./components/adminPanel";
import Layout from "./components/layout";

import "./styles/style.css";
import "./styles/authentication.css";
import "./styles/scoreCpf.css";
import "./styles/scoreCnpj.css";
import "./styles/sidebar.css";
import "./styles/editProfile.css";
import "./styles/adminPanel.css";
import "./styles/register.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas internas */}
          <Route element={<Layout />}>
            <Route path="/scoreCpf" element={<ScoreCpf />} />
            <Route path="/scoreCnpj" element={<ScoreCnpj />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adminPanel" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
