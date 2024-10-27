import mongoose from "mongoose";

export type UserDetails = {
    name: string;
    email: string;
}

export type UserDBDetails = {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
}
