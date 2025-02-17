import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "@/contexts/UserProvider";
import { PrivateRoute } from "@utils/PrivateRoute";
import { ThemeContext } from "@contexts/ThemeContext";
import { useContext } from "react";

import Login from "@pages/Login";
import Register from "@pages/Register";
import NotFound from "@pages/NotFound";
import Logout from "@pages/Logout";

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
            </Route>
            <Route element={<PrivateRoute acceptedRole={["user"]} />}>
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
