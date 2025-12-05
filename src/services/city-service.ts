// // import { CityRepository } from "../repositories/city-repository";
// import { AppError } from "../utils/errors/AppError";
// import { StatusCodes } from "http-status-codes";

// const cityRepo = new CityRepository()

// async function createCity(data : any){
//     try{
//         const result = await cityRepo.create(data);
//         return result
//     }catch(err : any){
//         if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'){
//             const explanation : any = [];
//             err.errors.forEach((err : any) => {
//                 explanation.push(err.message)
//             })
//             throw new AppError(explanation, StatusCodes.BAD_REQUEST)
//         }
//         throw err
//     }
// }

// async function getAllCities(){
//     try{
//         const cities = await cityRepo.getAll();
//         return cities
//     }catch(err : any){
//         throw new AppError(err, StatusCodes.INTERNAL_SERVER_ERROR)
//     }
// }

// async function getCity(id : any){
//     try{
//         const city = await cityRepo.get(id);
//         return city
//     }catch(err : any){
//         throw new AppError(err, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
//     }

// }

// async function deleteCity(id : any){
//     try {
//         const result = await cityRepo.destory(id);
//         return result
//     }catch(err : any){
//         throw new AppError(err, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
//     }
// }

// async function updateCity(data : any){
//     try{
//         const result = await cityRepo.update(data.id, data.updates);
//         return result
//     }catch(err : any){
//         throw new AppError(err, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
//     }
// }

// export default {
//     createCity,
//     getAllCities,
//     getCity,
//     deleteCity,
//     updateCity
// }
