import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";

function App() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
