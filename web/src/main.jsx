import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context.jsx";
import { BoardProvider } from "./contexts/board-context.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ThemeProvider } from "./contexts/dark-context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DndProvider backend={HTML5Backend}>
            <BoardProvider>
              <App />
            </BoardProvider>
          </DndProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);
