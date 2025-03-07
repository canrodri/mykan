import { Route, Routes } from "react-router-dom";
import {  Dashboard, HomePage, LoginPage, RegisterPage } from "./pages";
import { PrivateRoute } from "./guards";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
          <HomePage></HomePage>
          </PrivateRoute>}
          />
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
