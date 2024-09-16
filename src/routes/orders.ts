import {Router} from "express";
import {errorHandler} from "../error-handler";
import authMiddleware from "../middlewares/auth";
import {
    createOrder,
    deleteOrder,
    getOrderById,
    listAllOrders,
    listOrders,
    listUserOrders,
    updateStatus
} from "../controllers/orders";
import adminMiddleware from "../middlewares/admin";

const ordersRoutes: Router = Router()

ordersRoutes.post('/', [authMiddleware], errorHandler(createOrder));
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders));
ordersRoutes.delete('/:id', [authMiddleware], errorHandler(deleteOrder));
ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

// admin routes
ordersRoutes.get('/all', [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
ordersRoutes.get('/by-user/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
ordersRoutes.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(updateStatus));

export default ordersRoutes