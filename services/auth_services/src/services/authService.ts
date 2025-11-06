import { type AuthToken } from "../../../../shared/types/index";
import prisma from "../db/database";
import { createServiceError } from '../../../../shared/utility/index';
import bcrypt from 'bcryptjs'
import jwt, {type SignOptions} from 'jsonwebtoken'
import {type StringValue} from 'ms'


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

    // login an user
   async login(email: string, password : string) : Promise<AuthToken>{
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if(!user){
            throw createServiceError("Invalid email or password", 401)
        }
        const checkPassword = bcrypt.compare(password, user.password)
        if(!checkPassword){
            throw createServiceError("Incorrect email or password", 401)
        }
        return this.generateTokens(email,password);
    }

    // generate tokens for authetication and login
    private async generateTokens(userId : string, email : string) : Promise<AuthToken> {
        const payload = {userId, email}
        const signOptions : SignOptions = {
            expiresIn : this.jwtExpiresIn as StringValue
        }
        const accessToken = jwt.sign(payload, this.jwtSecret, signOptions) as string
        const refreshOptions : SignOptions = {
            expiresIn : this.jwtRefreshExpiresIn as StringValue
        }
        const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, refreshOptions) as string
        // set expire date for a token entry in db table
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7)
        await prisma.refreshToken.create({
            data : {
                userId,
                token : accessToken,
                expiresAt
            }
        })
        return{
            accessToken,
            refreshToken
        }
    }

}