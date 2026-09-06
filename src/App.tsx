import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskHub from "./pages/TaskHub.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Tasks from "./pages/Tasks.tsx";

function App() {
    return (
        <BrowserRouter>
            {/*<nav>*/}
            {/*    <Link to="/">TaskHub</Link> |*/}
            {/*    <Link to="/login">Login</Link> |*/}
            {/*    <Link to="/register">Register</Link> |*/}
            {/*    <Link to="/tasks">Tasks</Link>*/}
            {/*</nav>*/}
            <Routes>
                <Route path="/" element={<TaskHub />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/tasks" element={<Tasks />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;