export interface OpportunityProps {
    id: string;
    title: string;
    company: string;
    location: string;
    website: string;
    tags?: string[];
    status: string;
    userId: number;
}
