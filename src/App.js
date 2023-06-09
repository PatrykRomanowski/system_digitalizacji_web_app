import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import StartPage from "./startPage";
import LoginPage from "./loginPage";
import RegisterPage from "./registerPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<StartPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
