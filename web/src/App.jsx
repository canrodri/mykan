import { Route, Routes } from "react-router-dom";
import {  Dashboard, HomePage, LoginPage, RegisterPage } from "./pages";
import { ThemeProvider } from "./contexts/dark-context";

function App() {
  return (
    <>
    <ThemeProvider>

    
      <Routes>
        <Route path="/" element={<HomePage />}
          />
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
