import {Request, Response, Router} from 'express'
import authRoutes from "./auth";
import {prismaClient} from "../index";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);

// Database health check route
rootRouter.get('/db-health', async (_req: Request, res: Response) => {
    try {
        // Run a simple query to check database connectivity
        await prismaClient.$queryRaw`SELECT 1`;

        res.status(200).json({
            status: 'ok',
            message: 'Database connected successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: (error as Error).message
        });
    }
});

export default rootRouter