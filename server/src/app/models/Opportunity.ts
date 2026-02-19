import { Schema, model, type InferSchemaType } from "mongoose";

const oppSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["applied", "interviewing", "offered", "rejected"],
            default: "applied",
            required: [true, "Opportunity status is required"],
        },
        tags: [
            {
                type: String,
            },
        ],
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Associated user is required"],
        },
    },
    { timestamps: true },
);

export type Opp = InferSchemaType<typeof oppSchema>;
const OppModel = model<Opp>("Opp", oppSchema);
export default OppModel;
