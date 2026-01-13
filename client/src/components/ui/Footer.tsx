import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-cyan-600 py-4 mt-10 text-sm text-white justify-center items-center flex flex-col gap-2">
            <span>&copy; 2026 by Phillip Cantu. All Rights Reserved.</span>
            <div className="flex gap-4">
                <Link
                    to="https://github.com/hereisphil/app-track"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300"
                >
                    <FaGithub size={18} />
                </Link>
                <Link
                    to="https://www.linkedin.com/in/phillipcantu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300"
                >
                    <FaLinkedin size={18} />
                </Link>
                <Link
                    to="mailto:hello@phillipcantu.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300"
                >
                    <FaEnvelope size={18} />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
