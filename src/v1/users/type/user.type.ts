import mongoose from "mongoose";

import { FinalResponse } from "src/dto/common.dto";

export type UserDetails = FinalResponse & {
    data: {
        name: string;
        email: string;
    }
}

export type UserDBDetails = {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
}
