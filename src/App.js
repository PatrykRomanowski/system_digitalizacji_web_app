import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";

import store from "./storage";
import "./App.css";

import StartPage from "./startPage";
import LoginPage from "./loginPage";
import RegisterPage from "./registerPage";
import MainPageUser from "./userComponents/mainPageUser";
import LogoutUser from "./userComponents/logoutUser";
import MainPageAdmin from "./adminComponents/mainPageAdmin";
import LogoutAdmin from "./adminComponents/logoutAdmin";
import ShowGallery from "./userComponents/fileCategory/showGallery";
import ShowGalleryBook from "./userComponents/fileCategory/showGalleryBook";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<StartPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/adminPanel" element={<MainPageAdmin />}></Route>
            <Route path="/userPanel" element={<MainPageUser />}></Route>
            <Route path="/logoutUser" element={<LogoutUser />}></Route>
            <Route path="/logoutAdmin" element={<LogoutAdmin />}></Route>
            <Route path="/showGallery" element={<ShowGallery />}></Route>
            <Route
              path="/showGalleryBook"
              element={<ShowGalleryBook />}
            ></Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
