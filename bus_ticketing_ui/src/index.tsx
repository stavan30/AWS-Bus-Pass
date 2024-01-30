import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Checkout from "./components/Checkout";
import LoginRegistration from "./components/LoginRegistration";
import MyTickets from "./components/MyTickets";

const router = createBrowserRouter([
  {
    path: "home",
    element: <App />,
  },
  {
    path: "checkout",
    element: <Checkout />,
  },
  {
    path: "login",
    element: <LoginRegistration />,
  },
  {
    path: "",
    element: <LoginRegistration />,
  },
  {
    path: "my-tickets",
    element: <MyTickets />,
  },
]);

createRoot(document.getElementById("root") as Element).render(
  <RouterProvider router={router} />
);

reportWebVitals();

// copy dir to s3
// aws s3 cp ./build s3://ticket-ui.rishikeshcloudprojects.com --recursive
