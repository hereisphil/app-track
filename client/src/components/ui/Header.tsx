import { useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/userRoutes";

const Header = () => {
    const { isAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsMenuOpen(false);
        try {
            await logoutUser();
            setUser(null);
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
            );
        }
    };

    return (
        <header className="bg-cyan-600 px-4 py-6 mb-4 font-semibold">
            <div className="mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div className="flex w-full items-center justify-between md:w-auto">
                    <h2 className="text-xl text-white">
                        <Link to="/">App Track</Link>
                    </h2>
                    {isAuthenticated ? (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border-2 border-white p-2 text-white hover:bg-white hover:text-cyan-600 transition md:hidden"
                            aria-label="Toggle navigation"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((open) => !open)}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <path
                                    fill="currentColor"
                                    d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"
                                />
                            </svg>
                        </button>
                    ) : null}
                </div>

                {isAuthenticated ? (
                    <nav
                        className={`${
                            isMenuOpen ? "flex" : "hidden"
                        } flex-col w-full max-w-40 gap-3 md:flex md:max-w-none md:w-auto md:flex-row md:gap-4`}
                    >
                        <NavLink
                            to="/dashboard"
                            className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition text-center w-full md:w-auto"
                            onClick={() => setIsMenuOpen(false)}
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
