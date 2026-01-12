import type { OpportunityProps } from "../@types/oppTypes";
import { getLoggedInUser } from "./userRoutes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetch helper that:
 * - sends cookies (sessions) via credentials: "include"
 * - parses JSON exactly once
 * - throws a useful error message on non-2xx
 */
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        credentials: "include", // IMPORTANT for express-session cookies
    });

    // Parse once
    const data = (await res.json()) as unknown;
    // If not ok, try to surface backend message
    if (!res.ok) {
        const message =
            typeof data === "object" && data !== null && "message" in data
                ? String(data.message)
                : `HTTP error! status: ${res.status}`;
        throw new Error(message);
    }

    return data as T;
}

export async function getAllOpps() {
    getLoggedInUser(); // Ensure user is logged in before fetching opps
    const data = await fetchJson("/opps", { method: "GET" });
    return data;
}

export async function createOpp(
    oppData: Omit<OpportunityProps, "id">
): Promise<{ success: boolean; message: string; opp: OpportunityProps }> {
    getLoggedInUser(); // Ensure user is logged in before creating an opp
    const data: { success: boolean; message: string; opp: OpportunityProps } =
        await fetchJson("/opps", {
            method: "POST",
            body: JSON.stringify(oppData),
        });

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
}
