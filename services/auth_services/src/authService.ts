import { type AuthToken } from "../../../shared/types/index";
import prisma from "./database";
import { createServiceError } from '../../../shared/utility/index';
import bcrypt from 'bcryptjs'

export class AuthService {
    private readonly jwtSecret : string;
    private readonly jwtRefreshSecret : string;
    private readonly jwtExpiresIn : string;
    private readonly jwtRefreshExpiresIn : string;
    private readonly bcryptRounds : number;

    constructor(){
        this.jwtSecret = process.env.JWT_SECRET!;
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
        this.jwtExpiresIn = process.env.JWT_EXPIRE || '15m';
        this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRE || '7d';
        this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS!) || 10; 

        if(!this.jwtSecret || !this.jwtRefreshSecret){
            throw new Error("Environment variabels not found")
        }
    }

    // register a user
    async register(email : string, password : string) : Promise<AuthToken> {
        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(existingUser){
            throw createServiceError("User already registered", 400);
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, this.bcryptRounds);

        // add user to database
        const user = await prisma.user.create({
            data : {
                email,
                password : hashedPassword
            }
        })

        // send token
        return this.generateTokens(user.id, user.email);

    }

    async generateTokens(id : string, email : string) : Promise<AuthToken> {

    }

}