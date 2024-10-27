import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class LoginPaylodDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class RegisterPayloadDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
    password: string;
}

export class changePasswordDto {
    @IsString()
    password: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: 'New Password must contain at least one number' })
    newPassword: string;
}

export class forgotPasswordDto {
    @IsEmail()
    email: string;
}

export class resetPasswordDto {
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: 'New Password must contain at least one number' })
    newPassword: string;

    @IsString()
    token: string;
}
