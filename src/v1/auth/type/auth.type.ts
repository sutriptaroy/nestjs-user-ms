import mongoose from "mongoose";

export type UserPaylodDto = {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
}

export type LoginResponse = {
    accessToken: string;
}

export type ResetTokenType = {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiryDate: Date;
}
