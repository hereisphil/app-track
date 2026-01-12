import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { signUpUser } from "../../../services/userRoutes";

const SignUpForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const user = await signUpUser({ email, password });
            console.log("Signed up:", user);
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error signing up user:", error);
            toast.error("Failed to create account");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <form className="flex flex-col gap-4 min-w-sm" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-cyan-600 text-center">
                Register:{" "}
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
                Sign Up
            </button>
            <p className="text-sm text-gray-400 text-center">
                Already have an account?{" "}
                <span className="font-bold">Login</span>
            </p>
        </form>
    );
};

export default SignUpForm;
