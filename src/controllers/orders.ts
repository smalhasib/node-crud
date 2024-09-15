import {Request, Response} from 'express';
import {prismaClient} from "../index";
import {NotFoundException} from "../exceptions/not-found";
import {ErrorCode} from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        });

        if (cartItems.length == 0) {
            return res.json({
                message: 'Cart is Empty'
            });
        }

        const price = cartItems.reduce((acc, item) => {
            return acc + (item.quantity * +item.product.price);
        }, 0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddressId!,
            }
        });

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address!.formattedAddress,
                orderProducts: {
                    create: cartItems.map((item) => ({
                        quantity: item.quantity,
                        product: {
                            connect: {
                                id: item.productId
                            }
                        }
                    }))
                },
            }
        });
        await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        });
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        });

        return res.json(order);
    });
}

export const listOrders = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id
        },
    });
    res.json(orders);
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id,
            },
            include: {
                orderEvents: true,
                orderProducts: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(order);
    } catch (error) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        try {
            const order = await tx.order.findFirstOrThrow({
                where: {
                    id: +req.params.id,
                },
            });

            if (order.userId !== req.user.id) {
                return res.json({message: "Order does not belong to user"});
            }

            const updatedOrder = await tx.order.update({
                where: {
                    id: +req.params.id,
                },
                data: {
                    status: "CANCELLED"
                }
            });
            await tx.orderEvent.create({
                data: {
                    orderId: updatedOrder.id,
                    status: "CANCELLED"
                }
            });

            res.json(updatedOrder);
        } catch (error) {
            throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
        }
    })
}
