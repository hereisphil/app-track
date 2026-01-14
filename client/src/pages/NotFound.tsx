import { Link } from "react-router";

function NotFound() {
    return (
        <main className="max-w-6xl mx-auto p-8">
            <section className="text-cyan-600 flex flex-col items-center gap-4 text-center">
                <p className="text-sm uppercase tracking-widest text-cyan-500">
                    404 error
                </p>
                <h1 className="text-4xl md:text-5xl font-bold">
                    Page not found
                </h1>
                <p className="text-gray-600 max-w-md">
                    The page you are looking for does not exist or has been
                    moved.
                </p>
                <Link
                    to="/"
                    className="mt-2 inline-flex items-center justify-center py-3 px-6 border-2 border-cyan-600 rounded-md font-bold text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
                >
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default NotFound;
