import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@contexts/UserProvider';
import { PrivateRoute } from '@utils/PrivateRoute';
import { ThemeContext } from '@contexts/ThemeContext';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import UserRouteWrapper from '@layouts/wrappers/UserRouteWrapper';

import Login from '@/pages/visitor/Login';
import Register from '@/pages/visitor/Register';
import ForgotPassword from '@/pages/visitor/ForgotPassword';
import ResetPassword from '@/pages/visitor/ResetPassword';

import NotFound from '@/pages/common/NotFound';

import Logout from '@/pages/user/Logout';
import Home from '@/pages/user/Home';
import Me from '@/pages/user/Me';
import UpsertQuizz from '@/pages/user/UpsertQuizz';
import UserQuizz from '@/pages/user/UserQuizz';
import AnswerQuizz from '@/pages/user/AnswerQuizz';

import Stats from '@/pages/admin/Stats';

function App() {
  const { theme, themeColor } = useContext(ThemeContext)!;

  return (
    <UserProvider>
      <div
        className={`${theme} ${themeColor} min-h-screen overflow-y-auto overflow-x-hidden bg-themedBg`}
      >
        <ToastContainer />
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
                <PrivateRoute acceptedRole={['user', 'moderator', 'admin']} />
              }
            >
              <Route
                path="/home"
                element={<UserRouteWrapper children={<Home />} />}
              />
              <Route
                path="/quizz/create"
                element={<UserRouteWrapper children={<UpsertQuizz />} />}
              />
              <Route
                path="/quizz/update/:quizzId"
                element={<UserRouteWrapper children={<UpsertQuizz />} />}
              />
              <Route
                path="/my-quizzes"
                element={<UserRouteWrapper children={<UserQuizz />} />}
              />
              <Route
                path="/quizz/response/:quizzId"
                element={<UserRouteWrapper children={<AnswerQuizz />} />}
              />
              <Route
                path="/me"
                element={<UserRouteWrapper children={<Me />} />}
              />
              <Route path="/logout" element={<Logout />} />
            </Route>
            <Route element={<PrivateRoute acceptedRole={['admin']} />}>
              <Route
                path="/stats"
                element={<UserRouteWrapper children={<Stats />} />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
