import { AirplaneRepository } from "../repositories/airplane-repository";

const airplaneRepo = new AirplaneRepository()

export async function createAirplane(data:any){
    try{
        const airplane = await airplaneRepo.create(data);
        return airplane;
    }catch(err){
        throw err
    }
}


