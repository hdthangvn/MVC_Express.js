import express from "express";
import homeController from "../controllers/homeController.js";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/contact', homeController.getContact);
    

    return app.use("/", router);
} 

export default initWebRoutes;