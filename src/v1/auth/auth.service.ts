import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/v1/users/users.service';
import { LoginPaylodDto, changePasswordDto, RegisterPayloadDto, forgotPasswordDto, resetPasswordDto } from './dto/auth.dto';
import { LoginResponse, ResetTokenType, TokenResponse } from './type/auth.type';
import { FinalResponse, SendMail } from 'src/dto/common.dto';
import { ResetToken } from 'src/schemas/resetToken.schema';
import { MailService } from 'src/service/mail.service';
import { TokenStatus } from 'src/enums/token.enums';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
        private userService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
        private configService: ConfigService
    ) {}

    async registration(input: RegisterPayloadDto): Promise<FinalResponse> {
        const { email, password } = input

        const userDetails = await this.userService.getByEmail(email)

        if (userDetails) {
            throw new ConflictException('Email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUserPayload = {
            ...input,
            password: hashedPassword
        }

        const res = await this.userService.create(newUserPayload)
        if (res._id) {
            return {
                message: 'User Successfully Created'
            }
        }

        throw new InternalServerErrorException('Something went wrong')
    }

    async authenticate(input: LoginPaylodDto): Promise<LoginResponse>{
        const userId: string = await this.validateUser(input)
        const accessTokenPayload = await this.generateToken(userId)
        return {
            message: 'Successfylly Logged In',
            data: accessTokenPayload
        }
    }

    async validateUser(input: LoginPaylodDto): Promise<string> {
        const { email, password } = input

        const userDetails = await this.userService.getByEmail(email)

        if (!userDetails) {
            throw new NotFoundException('User not found')
        }

        const passwordValidation = await bcrypt.compare(password, userDetails.password)
        if (!passwordValidation) {
            throw new UnauthorizedException('Wrong Password')
        }

        return userDetails._id.toString()
    }

    async generateToken(userId: string): Promise<TokenResponse> {
        const tokenPayload = {
            sub: userId,
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload, { expiresIn: '1d' })

        return {
            accessToken
        }
    }

    async changePassword(userId: string, input: changePasswordDto): Promise<FinalResponse> {
        const userDetails = await this.userService.getById(userId)

        if (!userDetails) {
            throw new NotFoundException('User not found')
        }

        const passwordValidation = await bcrypt.compare(input.password, userDetails.password)
        if (!passwordValidation) {
            throw new UnauthorizedException('Wrong Password')
        }

        const hashedPassword = await bcrypt.hash(input.newPassword, 10)
        const res = await this.userService.updateById(userDetails._id.toString(), { password: hashedPassword })
        if (res.acknowledged) {
            return {
                message: 'Password Successfully Updated'
            }
        }

        throw new InternalServerErrorException('Something went wrong')
    }

    async forgotPassword(input: forgotPasswordDto): Promise<FinalResponse> {
        const { email } = input

        const userDetails = await this.userService.getByEmail(email)

        if (!userDetails) {
            throw new NotFoundException('User not found')
        }

        const resetToken = uuidv4()
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const resetTokenPayload: ResetTokenType = {
            userId: userDetails._id,
            token: resetToken,
            expiryDate
        }
        const res = await this.ResetTokenModel.create(resetTokenPayload)
        if (res._id) {
            const appUrl = this.configService.get<string>('appUrl');
            const resetPasswordPath = this.configService.get<string>('resetPasswordPath');
            const resetPasswordLink = `${appUrl}${resetPasswordPath}?token=${resetToken}`

            const mailPayload: SendMail = {
                to: email,
                subject: 'Reset Password',
                html: `<a href=${resetPasswordLink}>Click here</a> to reset your password`
            }
            this.mailService.sendMail(mailPayload)
            return {
                message: 'Reset Password Mail Sent'
            }
        }

        throw new InternalServerErrorException('Something went wrong')
    }

    async resetPassword(input: resetPasswordDto): Promise<FinalResponse> {
        const tokenFromDb = await this.ResetTokenModel.findOne({
            token: input.token,
            expiryDate: { $gte: new Date() },
            status: TokenStatus.PENDING
        })

        if (!tokenFromDb) {
            throw new UnauthorizedException('Invalid Link')
        }

        const userDetails = await this.userService.getById(tokenFromDb.userId.toString())

        if (!userDetails) {
            throw new NotFoundException('User not found')
        }

        const hashedPassword = await bcrypt.hash(input.newPassword, 10)
        const res = await this.userService.updateById(userDetails._id.toString(), { password: hashedPassword })
        if (res.acknowledged) {
            await this.ResetTokenModel.updateOne({ token: input.token }, { status: TokenStatus.EXPIRED })
            return {
                message: 'Password Successfully Updated'
            }
        }

        throw new InternalServerErrorException('Something went wrong')
    }
}
