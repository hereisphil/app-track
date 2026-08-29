import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
    checkForUser,
    loginUser,
    signUpUser,
} from "../../services/userRoutes";

const AuthForm = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [emailTaken, setEmailTaken] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);

    // Debounced availability check — only drives the hint text below the
    // email field. The submit handler re-checks, so a stale hint is harmless.
    useEffect(() => {
        if (!email.trim()) {
            setEmailTaken(null);
            return;
        }

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

    // Logs in when the email already has an account, signs up otherwise.
    async function authenticate(email: string, password: string) {
        const { isTaken } = await checkForUser(email);
        if (isTaken) {
            return {
                user: await loginUser({ email, password }),
                created: false,
            };
        }
        try {
            return {
                user: await signUpUser({ email, password }),
                created: true,
            };
        } catch (error) {
            // The account may have been created between the check and the
            // signup — fall back to logging in.
            if (
                error instanceof Error &&
                error.message === "User with this email already exists."
            ) {
                return {
                    user: await loginUser({ email, password }),
                    created: false,
                };
            }
            throw error;
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const { user, created } = await authenticate(email, password);
            setUser(user);
            toast.success(created ? "Account created!" : "Welcome back!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error authenticating user:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
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
                Sign In or Sign Up:{" "}
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
                    setEmailTaken(null);
                }}
                required
            />
            {!checking && emailTaken !== null && (
                <p className="text-sm text-gray-500 text-center">
                    {emailTaken
                        ? "This email has an account — enter your password to log in."
                        : "New here? Submitting will create your account."}
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
            <p className="text-xs text-gray-500 text-center">
                Password must be at least 8 characters long.
            </p>
            <button
                type="submit"
                className="py-4 px-8 border-2 border-cyan-600 rounded-md font-bold text-cyan-600 hover:bg-cyan-600 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-cyan-600"
                disabled={isSubmitting}
            >
                Continue
            </button>
            <p className="text-sm text-gray-400 text-center">
                We&apos;ll log you in — or create your account if you&apos;re
                new.
            </p>
        </form>
    );
};

export default AuthForm;
