import {Router} from "express";
import {errorHandler} from "../error-handler";
import authMiddleware from "../middlewares/auth";
import {createOrder, deleteOrder, getOrderById, listOrders} from "../controllers/orders";

const ordersRoutes: Router = Router()

ordersRoutes.post('/', [authMiddleware], errorHandler(createOrder));
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders));
ordersRoutes.delete('/:id', [authMiddleware], errorHandler(deleteOrder));
ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

export default ordersRoutes