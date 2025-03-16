import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/dark-context";

function Dailytasks() {
    const [goals, setGoals] = useState(null);
    const { theme } = useTheme();
  
    // Cargar goals desde localStorage al inicio
    useEffect(() => {
      const savedGoals = JSON.parse(localStorage.getItem("dailyGoals"));
      if (savedGoals) {
        setGoals(savedGoals);
      } else {
        setGoals([
          { id: 1, text: "", completed: false },
          { id: 2, text: "", completed: false },
          { id: 3, text: "", completed: false },
          { id: 4, text: "", completed: false },
        ]);
      }
    }, []);
  
    // Guardar goals en localStorage cada vez que cambien
    useEffect(() => {
      if (goals) {
        localStorage.setItem("dailyGoals", JSON.stringify(goals));
      }
    }, [goals]);
  
    // Función para actualizar el texto de un goal
    const updateGoalText = (goalId, newText) => {
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, text: newText } : goal
        )
      );
    };
  
    // Función para marcar/desmarcar un goal como completado
    const toggleCompletion = (goalId) => {
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        )
      );
    };
  
    if (!goals) {
      return <div>Loading goals...</div>;
    }


    return (
<div
      className={`p-4 rounded-lg shadow-md border ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } relative mt-6 mr-2 font-light`}
    >
      {/* Título */}
      <h2 className={`text-xl text-center font-bold font-roboto-condensed ${
        theme === "dark" ? "text-gray-200" : "text-gray-800"
      } mb-6`}>
        Goals for the Day
      </h2>

      {/* Lista de goals */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-start space-x-4">
            {/* Botón de completado */}
            <button
              onClick={() => toggleCompletion(goal.id)}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                goal.completed
                  ? "border-[#981AE2] bg-[#981AE2]"
                  : theme === "dark" ? "border-gray-400" : "border-gray-400"
              }`}
            >
              {goal.completed && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            {/* Campo de texto editable */}
            <textarea
              value={goal.text}
              onChange={(e) => updateGoalText(goal.id, e.target.value)}
              className={`w-full bg-transparent border-none outline-none text-sm font-roboto resize-none ${
                goal.completed
                  ? "text-gray-500 line-through"
                  : theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
              placeholder="Add a goal"
              rows={1} 
              style={{ overflow: "hidden" }} 
              onInput={(e) => {
                // Ajusta la altura del textarea automáticamente
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
        ))}
      </div>
    </div>
    );
};

export default Dailytasks;
