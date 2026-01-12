import { useEffect } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router";
import type { OpportunityProps } from "../../@types/oppTypes.ts";
import AddOpportunity from "../components/dashboard/AddOpportunity";
import OppCard from "../components/dashboard/OppCard";
import { useAuth } from "../context/AuthContext";

const cardBgClasses = [
    "bg-white",
    "bg-cyan-100",
    "bg-yellow-100",
    "bg-teal-100",
];

const opportunities: OpportunityProps[] = [
    {
        id: 1,
        title: "Software Engineer",
        company: "Tech Corp",
        location: "New York, NY",
        website: "www.techcorp.com",
        tags: ["#engineering", "#full-time", "#remote"],
        status: "applied",
    },
    {
        id: 2,
        title: "Product Manager",
        company: "Innovate Inc",
        location: "San Francisco, CA",
        website: "www.innovateinc.com",
        tags: ["#product", "#full-time", "#remote"],
        status: "interview",
    },
    {
        id: 3,
        title: "Data Analyst",
        company: "DataWorks",
        location: "Chicago, IL",
        website: "www.dataworks.com",
        tags: ["#data", "#contract", "#onsite"],
        status: "offer",
    },
    {
        id: 4,
        title: "Software Engineer",
        company: "Tech Corp",
        location: "New York, NY",
        website: "www.techcorp.com",
        tags: ["#engineering", "#full-time", "#remote"],
        status: "applied",
    },
    {
        id: 5,
        title: "Product Manager",
        company: "Innovate Inc",
        location: "San Francisco, CA",
        website: "www.innovateinc.com",
        tags: ["#product", "#full-time", "#remote"],
        status: "interview",
    },
    {
        id: 6,
        title: "Data Analyst",
        company: "DataWorks",
        location: "Chicago, IL",
        website: "www.dataworks.com",
        tags: ["#data", "#contract", "#onsite"],
        status: "offer",
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            toast.error("Please login or register to add opportunities.");
        }
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
                <AddOpportunity />
            </div>
            <div className="grid grid-cols-4 gap-4 my-8">
                {opportunities.map((opp, index) => (
                    <OppCard
                        key={opp.id}
                        opportunity={opp}
                        bgClass={cardBgClasses[index % cardBgClasses.length]}
                    />
                ))}
            </div>
        </main>
    );
};
export default Dashboard;
