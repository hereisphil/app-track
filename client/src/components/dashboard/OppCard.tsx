import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import type { OpportunityProps } from "../../@types/oppTypes.ts";
type OppCardProps = {
    opportunity: OpportunityProps;
    bgClass?: string;
};

import { Link } from "react-router";

const OppCard = ({ opportunity, bgClass = "bg-white" }: OppCardProps) => {
    const [showForm, setShowForm] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setShowForm(false);
        toast.success("Opportunity Updated!");
    }

    return (
        <div
            className={`max-w-sm rounded overflow-hidden shadow-lg ${bgClass}`}
        >
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 flex justify-between items-center">
                    {opportunity.company}
                    <span>
                        <FaEdit
                            onClick={() => setShowForm(!showForm)}
                            size={15}
                            className="cursor-pointer hover:text-red-600 transition-all duration-300"
                        />
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
                            to={`${opportunity.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {opportunity.website}
                        </Link>
                    </li>
                    <li className="text-gray-700 text-base">
                        Status: {opportunity.status}
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
                        className="flex flex-col gap-4 bg-white rounded px-8 py-6 min-w-lg relative"
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
                            value={opportunity.company}
                            required
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Position Title"
                            value={opportunity.title}
                            required
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Location"
                            value={opportunity.location}
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Job Posting Website"
                            value={opportunity.website}
                        />
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                            >
                                Submit
                            </button>
                            <button
                                type="submit"
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
        </div>
    );
};

export default OppCard;
