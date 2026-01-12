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
    const [isLogin, setIsLogin] = useState(false); // false = signup shown

    return (
        <main className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between gap-8">
                <Hero />
                {isLogin ? (
                    <LoginForm showSignup={() => setIsLogin(false)} />
                ) : (
                    <SignUpForm showLogin={() => setIsLogin(true)} />
                )}
            </div>
        </main>
    );
}

export default Home;
