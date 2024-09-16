import {Request, Response} from "express";
import {prismaClient} from "../index";
import {CreateProductSchema, SearchProductSchema, UpdateProductSchema} from "../schema/products";
import {NotFoundException} from "../exceptions/not-found";
import {ErrorCode} from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
    const body = CreateProductSchema.parse(req.body);

    const product = await prismaClient.product.create({
        data: {
            ...body,
            tags: body.tags.join(',')
        }
    });

    res.json(product);
}

export const updateProduct = async (req: Request, res: Response) => {
    const body = UpdateProductSchema.parse(req.body);

    try {
        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: {
                tags: body.tags?.join(','),
                name: body.name,
                description: body.description,
                price: body.price,
            }
        });
        res.json(updatedProduct);
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            },
        });
        res.json(product);
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const listProducts = async (req: Request, res: Response) => {
    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip: req.query.skip ? +req.query.skip : 0,
        take: req.query.take ? +req.query.take : 10,
    });
    res.json({
        count,
        data: products
    });
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
        });
        res.json(product);
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    const {q} = SearchProductSchema.parse(req.query);
    const products = await prismaClient.product.findMany({
        skip: req.query.skip ? +req.query.skip : 0,
        take: req.query.take ? +req.query.take : 10,
        where: {
            OR: [
                {
                    name: {
                        contains: q,
                        mode: 'insensitive',
                    }
                },
                {
                    description: {
                        contains: q,
                        mode: 'insensitive',
                    }
                },
                {
                    tags: {
                        contains: q,
                        mode: 'insensitive',
                    }
                },
            ]
        }
    });
    res.json(products);
}
