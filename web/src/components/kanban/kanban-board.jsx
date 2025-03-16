import { useEffect } from "react";
import TaskList from "../../components/task/task-list";
import { useBoard } from "../../contexts/board-context";

function KanbanBoard() {
  const { columns, loadBoard } = useBoard(); 

  useEffect(() => {
    loadBoard(); 
  }, [loadBoard]);

  return (
      <div className="flex flex-col min-h-screen p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {columns && columns.length > 0 ? (
            columns.map((column) => (           
              <TaskList key={column._id} column={column} />
            ))
          ) : (
            <p>Loading columns...</p> 
          )}
   
        </div>
      </div>
  );
}

export default KanbanBoard;
