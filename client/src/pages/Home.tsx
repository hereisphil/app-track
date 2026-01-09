import Hero from "../components/ui/Hero";
import SignUpForm from "../components/ui/SignUpForm";

function Home() {
    return (
        <main className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between gap-8">
                <Hero />
                <SignUpForm />
            </div>
        </main>
    );
}

export default Home;
