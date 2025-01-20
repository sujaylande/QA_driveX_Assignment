import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import Home from "./page/Home";
import ReactDom from "react-dom/client";
import Signup from "./page/Signup";
import Login from "./page/Login"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const routerApp = createBrowserRouter([
  {
    path: "/",
    element: (<PrivateRoute>
      <Home/>
    </PrivateRoute>),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const root = ReactDom.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={routerApp} />);

export default App;
