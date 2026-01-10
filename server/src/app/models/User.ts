import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "User email is required"],
            unique: [true, "User with email already exists."],
            trim: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                "Email must match this format: email@email.com",
            ],
        },
        password: {
            type: String,
            required: [true, "User password is required"],
            select: false, // do not return password field by default
        },
    },
    { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;
const UserModel = model<User>("User", userSchema);
export default UserModel;
