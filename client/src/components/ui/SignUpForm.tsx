import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { checkForUser, signUpUser } from "../../services/userRoutes";

const SignUpForm = ({
    showLogin,
    onExistingAccount,
}: {
    showLogin: () => void;
    onExistingAccount: () => void;
}) => {
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
            const confirmPassword = formData.get("confirmPassword") as string;
            if (password !== confirmPassword) {
                toast.error("Passwords do not match. Please try again.");
                setIsSubmitting(false);
                return;
            }
            const user = await signUpUser({ email, password });
            console.log("Signed up:", user);
            setUser(user);
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error signing up user:", error);
            if (
                error instanceof Error &&
                error.message === "User with this email already exists."
            ) {
                toast.error(error.message);
                onExistingAccount();
            } else {
                toast.error("Failed to create account");
            }
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
                Register:{" "}
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

            {!checking && emailTaken && (
                <p style={{ color: "red" }}>
                    This email is already registered.{" "}
                    <button
                        type="button"
                        onClick={showLogin}
                        className="font-bold cursor-pointer hover:underline"
                    >
                        Sign in?
                    </button>
                </p>
            )}
            <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                autoComplete="new-password"
                className="py-4 px-8 border-2 border-gray-400 rounded-md"
                minLength={8}
                required
            />
            <p className="text-xs text-gray-500 text-center">
                Password must be at least 8 characters long.
            </p>
            <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="confirm password"
                autoComplete="new-password"
                className="py-4 px-8 border-2 border-gray-400 rounded-md"
                minLength={8}
                required
            />
            <button
                type="submit"
                className="py-4 px-8 border-2 border-cyan-600 rounded-md font-bold text-cyan-600 hover:bg-cyan-600 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-cyan-600"
                disabled={isSubmitting}
            >
                Sign Up
            </button>
            <p className="text-sm text-gray-400 text-center">
                Already have an account?{" "}
                <button
                    type="button"
                    className="font-bold cursor-pointer hover:underline"
                    onClick={showLogin}
                >
                    Login
                </button>
            </p>
        </form>
    );
};

export default SignUpForm;
