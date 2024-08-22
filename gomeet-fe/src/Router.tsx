import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";

export const router = createBrowserRouter([
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
  },
]);
