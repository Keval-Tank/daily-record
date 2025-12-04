import CrudRepository from "./crud-repository";
import db from "../models/index.cjs";
const City = db.City

export class CityRepository extends CrudRepository{
    constructor(){
        super(City)
    }
}