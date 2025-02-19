import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "@contexts/UserProvider";
import { PrivateRoute } from "@utils/PrivateRoute";
import { ThemeContext } from "@contexts/ThemeContext";
import { useContext } from "react";
import UserRouteWrapper from "@layouts/wrappers/UserRouteWrapper";

import Login from "@pages/Login";
import Register from "@pages/Register";
import ForgotPassword from "@pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import NotFound from "@pages/NotFound";

import Logout from "@pages/Logout";
import Home from "@pages/Home";
import Me from "@pages/Me";

function App() {
  const { theme, themeColor } = useContext(ThemeContext)!;

  return (
    <UserProvider>
      <div
        className={`${theme} ${themeColor} min-h-screen overflow-y-auto overflow-x-hidden bg-themedBg`}
      >
        <Router>
          <Routes>
            <Route>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>
            <Route
              element={
                <PrivateRoute acceptedRole={["user", "moderator", "admin"]} />
              }
            >
              <Route
                path="/home"
                element={<UserRouteWrapper children={<Home />} />}
              />
              <Route
                path="/me"
                element={<UserRouteWrapper children={<Me />} />}
              />
              <Route path="/logout" element={<Logout />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
