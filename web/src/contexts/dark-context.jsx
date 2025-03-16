import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Función para obtener el tema inicial
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme; 
      }
      // Si no hay tema almacenado, usa la preferencia del sistema
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; 
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      console.log("Nuevo tema:", newTheme);
      return newTheme;
    });
  };

  // Efecto para aplicar el tema al HTML y almacenarlo en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlElement = document.documentElement;

      if (theme === "dark") {
        htmlElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        htmlElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      console.log("Clase aplicada al HTML:", htmlElement.classList);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// PropTypes para validar las propiedades
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext);