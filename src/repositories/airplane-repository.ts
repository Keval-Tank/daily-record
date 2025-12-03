import CrudRepository from "./crud-repository";
import db from "../models/index.cjs";
const Airplane = db.Airplane
console.log(Airplane)

export class AirplaneRepository extends CrudRepository{
    constructor(){
        super(Airplane)
    }
}


