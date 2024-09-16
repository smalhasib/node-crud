import {Router} from "express";
import {errorHandler} from "../error-handler";
import authMiddleware from "../middlewares/auth";
import {
    addAddress,
    deleteAddress,
    getUserById,
    listAddress,
    listUsers,
    updateUser,
    updateUserRole
} from "../controllers/users";
import adminMiddleware from "../middlewares/admin";

const usersRoutes: Router = Router()

usersRoutes.put('/', [authMiddleware], errorHandler(updateUser));
usersRoutes.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(updateUserRole));
usersRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers));
usersRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById));

// address route
usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress));

export default usersRoutes