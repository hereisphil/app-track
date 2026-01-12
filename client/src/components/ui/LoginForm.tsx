import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { loginUser } from "../../../services/userRoutes";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ showSignup }: { showSignup: () => void }) => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const user = await loginUser({ email, password });
            console.log("Logged in:", user);
            setUser(user);
            toast.success("Logged in successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error logging in user:", error);
            toast.error("Failed to log in");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <form className="flex flex-col gap-4 min-w-sm" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-cyan-600 text-center">
                Login:{" "}
            </h2>
            <input
                type="email"
                name="email"
                id="email"
                placeholder="email"
                className="py-4 px-8 border-2 border-gray-400 rounded-md"
                required
            />
            <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="py-4 px-8 border-2 border-gray-400 rounded-md"
                minLength={8}
                required
            />
            <button
                type="submit"
                className="py-4 px-8 border-2 border-cyan-600 rounded-md font-bold text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
                disabled={isSubmitting}
            >
                Login
            </button>
            <p className="text-sm text-gray-400 text-center">
                Don't have an account?{" "}
                <button
                    type="button"
                    className="font-bold cursor-pointer hover:underline"
                    onClick={showSignup}
                >
                    Sign up
                </button>
            </p>
        </form>
    );
};

export default LoginForm;
