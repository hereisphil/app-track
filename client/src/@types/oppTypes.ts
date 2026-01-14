export interface OpportunityProps {
    _id?: string;
    title: string;
    company: string;
    location: string;
    website: string;
    tags?: string[];
    status: string;
    userId: string;
}

export interface OpportunityResponse {
    success: boolean;
    message: string;
    Opportunities: [];
}
