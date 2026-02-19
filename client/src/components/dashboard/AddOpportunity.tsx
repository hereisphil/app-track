import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosAdd, IoIosClose } from "react-icons/io";
import type { OpportunityProps } from "../../@types/oppTypes";
import type { User } from "../../@types/userTypes";
import { createOpportunity } from "../../services/oppRoutes";
import { normalizeWebsite } from "../../util/urlHandler.ts";

const AddOpportunity = ({
    user,
    refreshOpps,
}: {
    user: User;
    refreshOpps: () => void;
}) => {
    const userId = user?.id;
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData(e.currentTarget);
            const oppData: OpportunityProps = {
                title: formData.get("title") as string,
                company: formData.get("company") as string,
                location: formData.get("location") as string,
                website: normalizeWebsite(formData.get("website") as string),
                status: (formData.get("status") as string).toLowerCase(),
                userId,
            };
            const response = await createOpportunity(oppData);
            if (!response.success) {
                toast.error("Failed to add opportunity");
                return;
            }
            refreshOpps();
            setShowForm(false);
            toast.success("Opportunity added!");
        } catch (error) {
            console.error("Error adding opportunity:", error);
            toast.error("Failed to add opportunity");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="bg-cyan-600 text-white h-11 w-11 rounded flex items-center justify-center hover:bg-cyan-700"
            >
                <IoIosAdd size={26} />
            </button>
            {showForm && (
                <div
                    className="fixed bg-black/50 min-h-screen z-10 w-screen flex justify-center items-center top-0 left-0"
                    onClick={() => setShowForm(!showForm)}
                >
                    <form
                        className="flex flex-col gap-4 bg-white rounded px-8 py-6 md:min-w-lg relative"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <h3 className="text-center font-bold text-xl mb-4">
                            Where did you apply?
                        </h3>
                        <label
                            htmlFor="company"
                            className="text-sm font-medium"
                        >
                            Company name
                        </label>
                        <input
                            type="text"
                            id="company"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Apple Inc."
                            name="company"
                            required
                        />
                        <label htmlFor="title" className="text-sm font-medium">
                            Position title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Junior Full Stack Developer"
                            name="title"
                            required
                        />
                        <label
                            htmlFor="location"
                            className="text-sm font-medium"
                        >
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Cupertino, CA"
                            name="location"
                        />
                        <label
                            htmlFor="website"
                            className="text-sm font-medium"
                        >
                            Job posting website
                        </label>
                        <input
                            type="text"
                            id="website"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="linkedin.com/jobs/view/dev-4343769943"
                            name="website"
                        />
                        <label htmlFor="status" className="text-sm font-medium">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                        >
                            <option defaultValue="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cyan-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowForm(!showForm)}
                            >
                                Cancel
                            </button>
                        </div>
                        <IoIosClose
                            className="cursor-pointer absolute top-2 right-2 md:top-4 md:right-4"
                            onClick={() => setShowForm(!showForm)}
                            size={30}
                        />
                    </form>
                </div>
            )}
        </>
    );
};
export default AddOpportunity;
