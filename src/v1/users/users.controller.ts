import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Request, UseGuards } from '@nestjs/common';

import { AuthGurad } from 'src/gurads/auth.guard';
import { UsersService } from './users.service';

@UseGuards(AuthGurad)
@Controller({ path: 'users', version: '1' })
export class UsersController {

    constructor(private userService: UsersService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get()
    async getUserDetails(@Request() request) {
        const userDetails = await this.userService.getById(request.user.userId)

        if (!userDetails) {
            throw new NotFoundException('User not found')
        }

        return {
            name: userDetails.name,
            email: userDetails.email
        }
    }
}
