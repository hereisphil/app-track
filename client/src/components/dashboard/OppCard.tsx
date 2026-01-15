import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router";
import type { OpportunityProps } from "../../@types/oppTypes.ts";
import {
    deleteOpportunity,
    updateOpportunity,
} from "../../services/oppRoutes.ts";
import { normalizeWebsite, toHttpsUrl } from "../../util/urlHandler.ts";

type OppCardProps = {
    opportunity: OpportunityProps;
    bgClass?: string;
    refreshOpps: () => void;
};

type DeleteOppResponse = {
    success: boolean;
    message: string;
};

const OppCard = ({
    opportunity,
    bgClass = "bg-white",
    refreshOpps,
}: OppCardProps) => {
    const [showForm, setShowForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [form, setForm] = useState<OpportunityProps>({
        _id: opportunity._id,
        company: opportunity.company,
        title: opportunity.title,
        location: opportunity.location,
        website: opportunity.website,
        status: (opportunity.status as OpportunityProps["status"]) ?? "applied",
        userId: opportunity.userId,
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            const formData = {
                ...form,
                website: normalizeWebsite(form.website),
            };
            const response = await updateOpportunity(formData);
            if (!response.success) {
                toast.error("Failed to add opportunity");
                return;
            }
            refreshOpps();
            setShowForm(false);
            toast.success("Opportunity Updated!");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Not updated.");
        }
    }

    async function handleDelete(): Promise<void> {
        setShowConfirmation(true);
        try {
            const response = (await deleteOpportunity(
                opportunity._id!
            )) as DeleteOppResponse;
            if (!response.success) {
                toast.error(response.message || "Failed to delete opportunity");
                return;
            }
            refreshOpps();
            toast.success("Opportunity Deleted!");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Not deleted.");
        } finally {
            setShowConfirmation(false);
        }
    }

    return (
        <div
            className={`max-w-sm rounded overflow-hidden shadow-lg ${bgClass}`}
        >
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 flex justify-between items-center">
                    {opportunity.company}
                    <span className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Edit opportunity"
                            onClick={() => setShowForm(!showForm)}
                            className="rounded p-1 hover:text-red-600 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                        >
                            <FaEdit size={15} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Delete opportunity"
                            onClick={() =>
                                setShowConfirmation(!showConfirmation)
                            }
                            className=" rounded p-1 hover:text-red-600 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                        >
                            <MdDeleteForever size={15} aria-hidden="true" />
                        </button>
                    </span>
                </div>
                <ul>
                    <li className="text-gray-700 text-base">
                        {opportunity.title}
                    </li>
                    <li className="text-gray-700 text-base">
                        {opportunity.location}
                    </li>
                    <li className="text-gray-700 text-base">
                        <Link
                            to={toHttpsUrl(opportunity.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {opportunity.website}
                        </Link>
                    </li>
                    <li className="text-gray-700 text-base">
                        Status:{" "}
                        {opportunity.status.charAt(0).toUpperCase() +
                            opportunity.status.slice(1)}
                    </li>
                </ul>
            </div>
            <div className="px-6 pt-4 pb-2">
                {opportunity.tags &&
                    opportunity.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                            {tag}
                        </span>
                    ))}
            </div>
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
                            {opportunity.company}
                        </h3>
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Company Name"
                            value={form.company}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    company: e.target.value,
                                }))
                            }
                            required
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Position Title"
                            value={form.title}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    title: e.target.value,
                                }))
                            }
                            required
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Location"
                            value={form.location}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    location: e.target.value,
                                }))
                            }
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Job Posting Website"
                            value={form.website}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    website: e.target.value,
                                }))
                            }
                        />
                        <select
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            value={form.status}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    status: e.target
                                        .value as OpportunityProps["status"],
                                }))
                            }
                        >
                            <option value="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                            >
                                Submit
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
                            className="cursor-pointer absolute top-4 right-4"
                            onClick={() => setShowForm(!showForm)}
                            size={30}
                        />
                    </form>
                </div>
            )}
            {showConfirmation && (
                <div className="fixed bg-black/50 min-h-screen z-10 w-screen flex justify-center items-center top-0 left-0">
                    <div
                        className="flex flex-col gap-4 bg-white rounded px-8 py-6 md:min-w-lg relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-center font-bold text-xl mb-4">
                            Delete this opportunity?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() =>
                                    setShowConfirmation(!showConfirmation)
                                }
                            >
                                Cancel
                            </button>
                        </div>
                        <IoIosClose
                            className="cursor-pointer absolute top-2 right-2 md:top-4 md:right-4"
                            onClick={() =>
                                setShowConfirmation(!showConfirmation)
                            }
                            size={30}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OppCard;
