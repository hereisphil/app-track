// import getLoggedInUser from "./userRoutes.ts";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function getAllOpportunities() {
    const data = await fetch(`${BASE_URL}/opps`, {
        method: "GET",
    });
    return data;
}
