import axios from 'axios'
import { JWTPayload, ServiceError, ServiceResponse } from '@shared/types';
import { createErrorResponse } from '@shared/utility';
import { createServiceError } from '@shared/utility';

export class AuthClient {
    private readonly authServiceUrl : string;

    constructor(){
        this.authServiceUrl = process.env.AUTH_SERVICE_URL
    }

    async validateToken(token : string) : Promise<JWTPayload> {
        try{
            const response = await axios.post(`${this.authServiceUrl}/auth/validate`, {}, {
                headers : {
                    Authorization : `Bearer ${token}`
                },
                timeout : 5000
            });
            if(!response.data.success || !response.data.data){
                throw createServiceError("Invalid Token", 401)
            }
            return response.data.data
        }catch(error : any){
            if(axios.isAxiosError(error)){
                throw createServiceError("Invalid Token", 404)
            }
            if(error.code === "ECONNRREFUSED"){
                throw createServiceError("Server Not responding", 503)
            }
            throw createServiceError("Unexpected Error")
        }
    }
}