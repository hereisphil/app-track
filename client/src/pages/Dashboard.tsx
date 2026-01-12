import { useEffect } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router";
import AddOpportunity from "../components/dashboard/AddOpportunity";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            toast.error("Please login or register to add opportunities.");
        }
    }, [isAuthenticated, navigate]);
    return (
        <main>
            <div className="flex justify-center gap-4">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search opportunities..."
                    className="border-2 border-gray-400 px-4 py-2 rounded-md"
                />
                <AddOpportunity />
            </div>
        </main>
    );
};
export default Dashboard;
