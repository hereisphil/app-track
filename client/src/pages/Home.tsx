import { useState } from "react";
import Hero from "../components/ui/Hero";
import LoginForm from "../components/ui/LoginForm";
import SignUpForm from "../components/ui/SignUpForm";

function Home() {
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
