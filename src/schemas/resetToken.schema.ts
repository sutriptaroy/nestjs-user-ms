import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';

import { User } from './user.schema';
import { TokenStatus } from '../enums/token.enums';

@Schema()
export class ResetToken extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    userId: User;

    @Prop({ type: String, required: true, unique: true })
    token: string;

    @Prop({ type: Date, required: true })
    expiryDate: Date;

    @Prop({ type: String, required: true, enum: TokenStatus, default: TokenStatus.PENDING })
    status: string;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken)
