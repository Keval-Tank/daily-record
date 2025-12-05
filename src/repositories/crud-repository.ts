// import Logger from "../config"
// import { AppError } from "../utils/errors/AppError";
// import { StatusCodes } from "http-status-codes";

// export default class CrudRepository{
//     model : any
//     constructor(model : any){
//         this.model = model
//     }

//     async create(data : string){
//         try{
//             const response = await this.model.create(data);
//             return response
//         }catch(err){
//             Logger.Logger.error('Something went wrong in crud repo : create')
//             console.log(err)
//             throw err
//         }
//     }

//     async destory(data:any){
//         try{
//             const response = await this.model.destroy({
//                 where : {
//                     id : data
//                 }
//             });
//             if(!response){
//                 throw new AppError("Requested Data to delete is not present", StatusCodes.NOT_FOUND)
//             }
//             return response
//         }catch(err){
//             Logger.Logger.error('Something went wrong in crud repo : destroy')
//             throw err
//         }
//     }

//     async get(data:any){
//         try{
//             const response = await this.model.findByPk(data);
//             if(!response){
//                 throw new AppError('Requested Data is not present', StatusCodes.NOT_FOUND)
//             }
//             return response
//         }catch(err : any){
//             Logger.Logger.error('Something went wrong in crud repo : get')
//             throw err
//         }
//     }

//     async getAll(){
//         try{
//             const response = await this.model.findAll()
//             return response
//         }catch(err){
//             Logger.Logger.error('Somethign went wrong in crud repo : getAll')
//             throw err
//         }
//     }

//     async update(id : string, data : any){
//         try{
//             const response = await this.model.update(data, {
//                 where : {
//                     id : id
//                 }
//             })
//             if(response[0] === 0){
//               throw new AppError("Requested Data is not present", StatusCodes.NOT_FOUND)
//             }
//             return response
//         }catch(err){
//             Logger.Logger.error('Something went wrong in crud repo : update');
//             throw err
//         }
//     }
// }