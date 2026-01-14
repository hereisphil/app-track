import type { OpportunityProps, OpportunityResponse } from "../@types/oppTypes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * A reusable helper function to handle API calls.
 * It automatically adds the correct headers and credentials.
 */
async function sendRequest<ResponseType>(
    endpoint: string,
    requestOptions: RequestInit = {}
): Promise<ResponseType> {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const response = await fetch(url, {
        ...requestOptions,
        headers: {
            ...defaultHeaders,
            ...requestOptions.headers,
        },
        credentials: "include", // Ensures cookies/sessions are sent to the backend
    });

    const responseData = await response.json();

    // If the backend returns an error (like 400, 401, 500)
    if (!response.ok) {
        // Use the message from the backend, or a generic one
        const errorMessage =
            responseData.message || `HTTP Error: ${response.status}`;
        throw new Error(errorMessage);
    }

    return responseData as ResponseType;
}

/* -------------------------------------------------------------------------- */
/*                              The API Functions                             */
/* -------------------------------------------------------------------------- */

export async function fetchAllOpportunities() {
    const responseData = await sendRequest<OpportunityResponse>("/opps", {
        method: "GET",
    });

    return responseData.Opportunities;
}

export async function createOpportunity(
    newOpportunityData: Omit<OpportunityProps, "id">
) {
    return sendRequest<{
        success: boolean;
        message: string;
        opp: OpportunityProps;
    }>("/opps", {
        method: "POST",
        body: JSON.stringify(newOpportunityData),
    });
}

export async function updateOpportunity(opportunityData: OpportunityProps) {
    return sendRequest<{
        success: boolean;
        message: string;
        opp: OpportunityProps;
    }>(`/opps/${opportunityData._id}`, {
        method: "PUT",
        body: JSON.stringify(opportunityData),
    });
}
