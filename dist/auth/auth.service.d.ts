import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    signIn(email: string, password: string): Promise<{
        access_token: string;
    }>;
    validate(payload: any): {
        userId: any;
        email: any;
    };
}
