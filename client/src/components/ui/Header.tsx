import { Link, NavLink } from "react-router";

interface HeaderProps {
    signup: {
        title: string;
        href: string;
    };
    dashboard?: {
        title: string;
        href: string;
    };
}

const Header = ({ signup }: HeaderProps) => {
    return (
        <header className="bg-cyan-600 px-4 py-8 mb-4 font-semibold flex justify-between">
            <h2 className="text-xl text-white">
                <Link to="/">App Track</Link>
            </h2>
            <nav>
                <NavLink
                    to={signup.href}
                    className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition"
                >
                    {signup.title}
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className="ml-4 text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition"
                >
                    Dashboard
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
