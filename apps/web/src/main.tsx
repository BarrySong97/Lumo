import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { TanstackProvider } from "./utils/tanstack-query/TanstackProvider"

import "./App.css"
import { router } from "./router"

createRoot(document.getElementById("root")!).render(
  <TanstackProvider>
    <RouterProvider router={router} />
  </TanstackProvider>
)
