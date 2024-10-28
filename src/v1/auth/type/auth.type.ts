import mongoose from "mongoose";

import { FinalResponse } from "src/dto/common.dto";

export type UserPaylodDto = {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
}

export type TokenResponse = {
    accessToken: string;
}

export type LoginResponse = FinalResponse & {
    data: {
        accessToken: string;
    }
}

export type ResetTokenType = {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiryDate: Date;
}
