import { createRoot } from "react-dom/client"
import { TanstackProvider } from "./utils/tanstack-query/TanstackProvider"

import "./App.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <TanstackProvider>
    <App />
  </TanstackProvider>
)
