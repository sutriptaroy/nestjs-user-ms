import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGurad implements CanActivate {

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { authorization } = request.headers // Bearer <token>
        const token = authorization?.split(' ')[1]

        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const tokenPayload = await this.jwtService.verifyAsync(token);
            request.user = {
                userId: tokenPayload.sub
            }
            return true
        } catch (e) {
            Logger.error(e.message)
            throw new UnauthorizedException()
        }
    }
}
