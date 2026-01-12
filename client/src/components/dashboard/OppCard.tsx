import type { OpportunityProps } from "../../../@types/oppTypes.ts";

type OppCardProps = {
    opportunity: OpportunityProps;
    bgClass?: string;
};

import { Link } from "react-router";

const OppCard = ({ opportunity, bgClass = "bg-white" }: OppCardProps) => {
    return (
        <div
            className={`max-w-sm rounded overflow-hidden shadow-lg ${bgClass} cursor-pointer hover:shadow-xl hover:bg-red-200 hover:outline-4 outline-red-600 transition-all duration-300`}
        >
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                    {opportunity.company}
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
                            to={`https://${opportunity.website}`}
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
        </div>
    );
};

export default OppCard;
