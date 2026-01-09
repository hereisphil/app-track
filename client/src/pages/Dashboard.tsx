import AddOpportunity from "../components/dashboard/AddOpportunity";

const Dashboard = () => {
    return (
        <main>
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
        </main>
    );
};
export default Dashboard;
