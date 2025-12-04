import { Router } from "express";
import controllers from "../../controllers";
import middlewares from "../../middlewares";

const router = Router()

router.post('/', middlewares.CityMiddlewares.validateCityRequest ,controllers.CityController.createCity)
router.get('/', controllers.CityController.getAllCities)
router.get('/:id', controllers.CityController.getCity);
router.delete('/:id', controllers.CityController.deleteCity)
router.patch('/', controllers.CityController.updateCity)

export default router