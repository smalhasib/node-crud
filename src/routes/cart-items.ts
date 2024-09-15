import {Router} from "express";
import {errorHandler} from "../error-handler";
import authMiddleware from "../middlewares/auth";
import {addItemsToCart, deleteItemsFromCart, getCart, updateQuantity} from "../controllers/cart-items";

const cartItemsRoutes: Router = Router()

cartItemsRoutes.post('/', [authMiddleware], errorHandler(addItemsToCart));
cartItemsRoutes.get('/', [authMiddleware], errorHandler(getCart));
cartItemsRoutes.put('/:id', [authMiddleware], errorHandler(updateQuantity));
cartItemsRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemsFromCart));

export default cartItemsRoutes