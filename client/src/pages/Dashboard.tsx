import { useEffect, useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router";
import type { OpportunityProps } from "../@types/oppTypes.ts";
import type { User } from "../@types/userTypes.ts";
import AddOpportunity from "../components/dashboard/AddOpportunity";
import OppCard from "../components/dashboard/OppCard.tsx";
import { useAuth } from "../context/AuthContext";
import { getAllOpps } from "../services/oppRoutes.ts";
import { getLoggedInUser } from "../services/userRoutes";

const cardBgClasses = [
    "bg-white",
    "bg-cyan-100",
    "bg-yellow-100",
    "bg-teal-100",
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // boolean
    const [user, setUser] = useState<User | null>(null);
    const [opportunities, setOpportunities] = useState<OpportunityProps[]>([]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            toast.error("Please login or register to add opportunities.");
            return;
        }
        const fetchData = async () => {
            const currentUser = await getLoggedInUser();
            const opps = await getAllOpps();
            setUser(currentUser);
            setOpportunities(opps);
        };
        fetchData();
    }, [isAuthenticated, navigate]);

    return (
        <main className="px-4">
            <div className="flex justify-center gap-4">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search opportunities..."
                    className="border-2 border-gray-400 px-4 py-2 rounded-md"
                />
                {user && <AddOpportunity user={user} />}
            </div>
            <div className="grid grid-cols-4 gap-4 my-8">
                {opportunities.length !== 0 ? (
                    opportunities.map((opp, index) => (
                        <OppCard
                            key={opp.id}
                            opportunity={opp}
                            bgClass={
                                cardBgClasses[index % cardBgClasses.length]
                            }
                        />
                    ))
                ) : (
                    <p className="text-amber-500 col-span-4 text-center text-2xl my-8">
                        No opportunities available. Please add some.
                    </p>
                )}
            </div>
        </main>
    );
};
export default Dashboard;
