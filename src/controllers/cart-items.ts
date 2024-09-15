import {Request, Response} from 'express';
import {CreateCartSchema, UpdateCartSchema} from "../schema/cart-items";
import {CartItem, Product} from "@prisma/client";
import {prismaClient} from "../index";
import {NotFoundException} from "../exceptions/not-found";
import {ErrorCode} from "../exceptions/root";
import {BadRequestsException} from "../exceptions/bad-requests";

export const addItemsToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }

    const cart = await prismaClient.cartItem.findFirst({
        where: {
            userId: req.user.id,
            productId: product.id
        }
    });

    if (cart) {
        const updatedCartItem = await prismaClient.cartItem.update({
            where: {
                id: cart.id
            },
            data: {
                quantity: cart.quantity + validatedData.quantity
            }
        });
        res.json(updatedCartItem);
    } else {
        const newCart = await prismaClient.cartItem.create({
            data: {
                userId: req.user.id,
                productId: product.id,
                quantity: validatedData.quantity
            }
        });
        res.json(newCart);
    }
}

export const deleteItemsFromCart = async (req: Request, res: Response) => {
    let cartItem: CartItem;
    try {
        cartItem = await prismaClient.cartItem.findFirstOrThrow({
            where: {
                id: +req.params.id,
            }
        });
    } catch (error) {
        throw new NotFoundException('Cart item not found', ErrorCode.CART_ITEM_NOT_FOUND);
    }

    if (cartItem.userId !== req.user.id) {
        throw new BadRequestsException('Cart item does not belong to user', ErrorCode.CART_ITEM_NOT_FOUND);
    }

    const deletedCartItem = await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id,
            userId: req.user.id,
        }
    });
    res.json(deletedCartItem);
}

export const updateQuantity = async (req: Request, res: Response) => {
    const validatedData = UpdateCartSchema.parse(req.body);
    try {
        const updatedCartItem = await prismaClient.cartItem.update({
            where: {
                id: +req.params.id,
                userId: req.user.id
            },
            data: validatedData
        });
        res.json(updatedCartItem);
    } catch (error) {
        throw new NotFoundException('Cart item not found', ErrorCode.CART_ITEM_NOT_FOUND);
    }
}

export const getCart = async (req: Request, res: Response) => {
    const cartItems = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id
        }
    });
    if (cartItems.length == 0) {
        return res.json({
            message: 'Cart is Empty'
        });
    } else {
        res.json(cartItems);
    }
}
