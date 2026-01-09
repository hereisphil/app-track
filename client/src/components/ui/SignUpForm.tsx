const SignUpForm = () => {
    return (
        <form className="flex flex-col gap-4 min-w-sm">
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
            >
                Sign Up
            </button>
        </form>
    );
};

export default SignUpForm;
