import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router";
import { logoutUser } from "../../../services/userRoutes";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const { isAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser(null);
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred"
            );
        }
    };

    return (
        <header className="bg-cyan-600 px-4 py-8 mb-4 font-semibold flex justify-between">
            <h2 className="text-xl text-white">
                <Link to="/">App Track</Link>
            </h2>
            {isAuthenticated ? (
                <nav>
                    <NavLink
                        to="/dashboard"
                        className="ml-4 text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition"
                    >
                        Dashboard
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="ml-4 text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition"
                    >
                        Logout
                    </button>
                </nav>
            ) : null}
        </header>
    );
};

export default Header;
