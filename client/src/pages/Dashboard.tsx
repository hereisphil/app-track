import { useEffect, useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router";
import type { OpportunityProps } from "../@types/oppTypes.ts";
import type { User } from "../@types/userTypes.ts";
import AddOpportunity from "../components/dashboard/AddOpportunity";
import OppCard from "../components/dashboard/OppCard.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { fetchAllOpportunities } from "../services/oppRoutes.ts";
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
    const [refreshOpps, setRefreshOpps] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            toast.error("Please login or register to add opportunities.");
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const currentUser = await getLoggedInUser();
                const opps = await fetchAllOpportunities();
                setUser(currentUser);
                setOpportunities(opps);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                toast.error("Failed to load opportunities.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, navigate, refreshOpps]);

    return (
        <main className="px-4">
            <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search opportunities..."
                            className="border-2 border-gray-400 px-4 py-2 rounded-md h-11"
                        />
                        {user && (
                            <AddOpportunity
                                refreshOpps={() =>
                                    setRefreshOpps((prev) => prev + 1)
                                }
                                user={user}
                            />
                        )}
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                        <em>Search isn't functional... YET!</em>
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 my-8 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
                {isLoading ? (
                    <p className="text-cyan-600 col-span-full text-center text-xl my-8">
                        Loading your opportunities...
                    </p>
                ) : opportunities.length !== 0 ? (
                    opportunities.map((opp, index) => (
                        <OppCard
                            key={opp._id}
                            opportunity={opp}
                            bgClass={
                                cardBgClasses[index % cardBgClasses.length]
                            }
                            refreshOpps={() =>
                                setRefreshOpps((prev) => prev + 1)
                            }
                        />
                    ))
                ) : (
                    <p className="text-amber-500 col-span-full text-center text-2xl my-8">
                        No opportunities available. Please add some.
                    </p>
                )}
            </div>
        </main>
    );
};
export default Dashboard;
