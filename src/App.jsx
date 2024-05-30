import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CreateGoal from "./pages/CreateGoal";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-goal" element={<CreateGoal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
