import Logger from "../config"

export default class CrudRepository{
    model : any
    constructor(model : any){
        this.model = model
    }

    async create(data : any){
        try{
            console.log(data)
            const response = await this.model.create(data);
            return response
        }catch(err){
            Logger.Logger.error('Something went wrong in crud repo : create')
            console.log(err)
            throw err
        }
    }

    async destory(data:any){
        try{
            const response = await this.model.destroy({
                where : {
                    id : data
                }
            });
            return response
        }catch(err){
            Logger.Logger.error('Something went wrong in crud repo : destroy')
            throw err
        }
    }

    async get(data:any){
        try{
            const response = await this.model.findByPk({
                where : {
                    id : data
                }
            });
            return response
        }catch(err){
            Logger.Logger.error('Something went wrong in crud repo : get')
            throw err
        }
    }

    async getAll(){
        try{
            const response = await this.model.findAll()
            return response
        }catch(err){
            Logger.Logger.error('Somethign went wrong in crud repo : getAll')
            throw err
        }
    }

    async update(id : string, data : any){
        try{
            const response = await this.model.update(data, {
                where : {
                    id : id
                }
            })
            return response
        }catch(err){
            Logger.Logger.error('Something went wrong in crud repo : update');
            throw err
        }
    }
}