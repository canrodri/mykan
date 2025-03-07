import KanbanBoard from "../components/kanban/kanban-board";
import  Navbar  from "../components/ui/navbar/navbar"
function Dashboard() {
    return(
        <>
            <Navbar></Navbar>
            <KanbanBoard />
            
        </>
    )
}
export default Dashboard;