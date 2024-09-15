import {Request, Response} from 'express';
import {AddAddressSchema, UpdateUserSchema} from "../schema/users";
import {prismaClient} from "../index";
import {NotFoundException} from "../exceptions/not-found";
import {ErrorCode} from "../exceptions/root";
import {Address} from "@prisma/client";
import {BadRequestsException} from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
    const body = AddAddressSchema.parse(req.body);

    const address = await prismaClient.address.create({
        data: {
            ...body,
            userId: req.user.id,
        }
    });
    res.json(address);
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const address = await prismaClient.address.delete({
            where: {
                id: req.user.id,
            }
        });
        res.json(address);
    } catch (error) {
        throw new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user.id,
        }
    });
    res.json(addresses);
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body);
    const {defaultBillingAddressId, defaultShippingAddressId} = validatedData;
    let shippingAddress: Address;
    let billingAddress: Address;

    if (defaultShippingAddressId) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: defaultShippingAddressId,
                }
            });
        } catch (error) {
            throw new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }

        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
        }
    }

    if (defaultBillingAddressId) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: defaultBillingAddressId,
                }
            });
        } catch (error) {
            throw new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }

        if (billingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user.id,
        },
        data: validatedData,
    });
    res.json(updatedUser);
}
