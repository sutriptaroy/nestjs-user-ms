import { Body, Controller, Get, HttpCode, HttpStatus, NotImplementedException, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGurad } from 'src/gurads/auth.guard';
import { LoginPaylodDto, changePasswordDto, RegisterPayloadDto, forgotPasswordDto, resetPasswordDto } from './dto/auth.dto';
import { FinalResponse } from 'src/dto/common.dto';
import { LoginResponse } from './type/auth.type';

@Controller({ path: 'auth', version: '1' })
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('register')
    registration(@Body() input: RegisterPayloadDto): Promise<FinalResponse> {
        return this.authService.registration(input)
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() input: LoginPaylodDto): Promise<LoginResponse> {
        return this.authService.authenticate(input)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGurad)
    @Post('change-password')
    changePassword(@Request() request, @Body() input: changePasswordDto): Promise<FinalResponse> {
        return this.authService.changePassword(request.user.userId, input)
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    forgotPassword(@Body() input: forgotPasswordDto): Promise<FinalResponse> {
        return this.authService.forgotPassword(input)
    }

    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    resetPassword(@Body() input: resetPasswordDto): Promise<FinalResponse> {
        return this.authService.resetPassword(input)
    }
}
