import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Request, UseGuards } from '@nestjs/common';

import { AuthGurad } from 'src/gurads/auth.guard';
import { UsersService } from './users.service';
import { UserDetails } from './type/user.type';

@UseGuards(AuthGurad)
@Controller({ path: 'users', version: '1' })
export class UsersController {

    constructor(private userService: UsersService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get()
    async getUserDetails(@Request() request): Promise<UserDetails> {
        const userDetails = await this.userService.getById(request.user.userId)

        if (!userDetails) {
            throw new NotFoundException('User not found')
        }

        return {
            message: 'User Details Fetched',
            data: {
                name: userDetails.name,
                email: userDetails.email
            }
        }
    }
}
