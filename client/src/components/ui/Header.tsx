import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/userRoutes";

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
        <header className="bg-cyan-600 px-4 py-6 mb-4 font-semibold">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-center">
                <h2 className="text-xl text-white">
                    <Link to="/">App Track</Link>
                </h2>

                {isAuthenticated ? (
                    <nav className="flex flex-col w-full max-w-40 gap-3 md:max-w-none md:w-auto md:flex-row md:gap-4">
                        <NavLink
                            to="/dashboard"
                            className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition text-center w-full md:w-auto"
                        >
                            Dashboard
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition text-center w-full md:w-auto"
                        >
                            Logout
                        </button>
                    </nav>
                ) : null}
            </div>
        </header>
    );
};

export default Header;
