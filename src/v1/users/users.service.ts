import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { User } from '../../schemas/user.schema';
import { UserDBDetails } from './type/user.type';
import { RegisterPayloadDto } from 'src/v1/auth/dto/auth.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

    async create(input: RegisterPayloadDto) {
        return this.UserModel.create(input)
    }
    
    async getByEmail(email: string): Promise<UserDBDetails | null> {
        return this.UserModel.findOne({email})
    }

    async getById(id: string): Promise<UserDBDetails | null> {
        return this.UserModel.findOne({ _id: new mongoose.Types.ObjectId(id) })
    }

    async updateById(id: string, input: object) {
        return this.UserModel.updateOne({ _id: new mongoose.Types.ObjectId(id) }, input)
    }
}
