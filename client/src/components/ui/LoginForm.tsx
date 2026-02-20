import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { checkForUser, loginUser } from "../../services/userRoutes";

const LoginForm = ({ showSignup }: { showSignup: () => void }) => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [emailTaken, setEmailTaken] = useState(false);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (!email) return;

        const timer = setTimeout(async () => {
            setChecking(true);
            try {
                const res = await checkForUser(email);

                setEmailTaken(res.isTaken);
            } catch (err) {
                console.error(err);
            } finally {
                setChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const user = await loginUser({ email, password });
            if (user) {
                setUser(user);
                toast.success("Logged in successfully!");
                navigate("/dashboard");
            } else {
                toast.error("Invalid login credentials");
            }
        } catch (error) {
            console.error("Error logging in user:", error);
            toast.error("Failed to log in");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <form
            className="flex flex-col gap-4 md:min-w-sm"
            onSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-bold text-cyan-600 text-center">
                Login:{" "}
            </h2>
            <input
                type="email"
                name="email"
                id="email"
                placeholder="email"
                autoComplete="email"
                className="py-4 px-8 border-2 border-gray-400 rounded-md"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailTaken(false);
                }}
                style={{ borderColor: emailTaken ? "red" : "#ccc" }}
                required
            />

            {!checking && !emailTaken && email.trim().length > 0 && (
                <p style={{ color: "red" }}>
                    No account found for this email.{" "}
                    <button
                        type="button"
                        onClick={showSignup}
                        className="font-bold cursor-pointer hover:underline"
                    >
                        Sign up?
                    </button>
                </p>
            )}
            <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                autoComplete="current-password"
                className="py-4 px-8 border-2 border-gray-400 rounded-md"
                minLength={8}
                required
            />
            <button
                type="submit"
                className="py-4 px-8 border-2 border-cyan-600 rounded-md font-bold text-cyan-600 hover:bg-cyan-600 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-cyan-600"
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
