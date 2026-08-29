import { useEffect } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router";
import AuthForm from "../components/ui/AuthForm";
import Hero from "../components/ui/Hero";
import Notification from "../components/ui/Notification";
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

    return (
        <main className="max-w-6xl mx-auto p-8">
            <div className="flex flex-col items-center md:items-start md:flex-row justify-between gap-8">
                <Hero />
                <div className="flex flex-col gap-4 w-full max-w-md">
                    <AuthForm />
                    <Notification />
                </div>
            </div>
        </main>
    );
}

export default Home;
