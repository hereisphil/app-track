import { useEffect, useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router";
import Hero from "../components/ui/Hero";
import LoginForm from "../components/ui/LoginForm";
import SignUpForm from "../components/ui/SignUpForm";
import { useAuth } from "../context/AuthContext";

function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect to dashboard if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Welcome back!");
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);
    const [signupNotice, setSignupNotice] = useState<string | null>(null);

    // Initialize state directly from localStorage
    const [isLogin, setIsLogin] = useState(() => {
        return localStorage.getItem("homeAuthView") === "login";
    });

    const setAuthView = (view: "login" | "signup") => {
        setIsLogin(view === "login");
        localStorage.setItem("homeAuthView", view);
    };

    const handleExistingAccount = () => {
        setSignupNotice(
            "Looks like you already have an account. Please log in to continue."
        );
        setAuthView("login");
    };

    const handleShowLogin = () => {
        setSignupNotice(null);
        setAuthView("login");
    };

    const handleShowSignup = () => {
        setSignupNotice(null);
        setAuthView("signup");
    };

    return (
        <main className="max-w-6xl mx-auto p-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <Hero />
                <div className="flex flex-col gap-4">
                    {signupNotice && (
                        <div
                            role="status"
                            className="rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700"
                        >
                            {signupNotice}
                        </div>
                    )}
                    {isLogin ? (
                        <LoginForm showSignup={handleShowSignup} />
                    ) : (
                        <SignUpForm
                            showLogin={handleShowLogin}
                            onExistingAccount={handleExistingAccount}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}

export default Home;
