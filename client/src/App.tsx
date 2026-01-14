import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
