import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";




interface CustomRequest extends Request {
    user?: any;
}



export const createOrder = async (req: CustomRequest, res: Response): Promise<void> => {
     await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cart.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" }); // Return early if the cart is empty
        }

        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price);
        }, 0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        });

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address ? address.formattedAddress : "", // Check if address exists before accessing its properties
                Products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        };
                    })
                }
            }
        });

        const orderEvent = await tx.orderEvent.create({ // Move this inside the transaction block
            data: {
                orderId: order.id
            }
        });

        await tx.cart.deleteMany({
            where: {
                userId: req.user.id
            }
        });

        return res.json(order);
    });
};


export const listOfOrders = async(req:CustomRequest,res:Response)=>{
   
    
    const orders=await prismaClient.order.findMany({
        where:{
            userId:req.user.id
        }
    })
    res.status(200).json(orders)
}


export const cancelOrder = async(req:Request,res:Response)=>{
   try {
    const order =await prismaClient.order.update({
        where:{
            id:+req.params.id 
        },
        data:{
            status:'CANCELLED'
        }
    })
    await prismaClient.orderEvent.create({
        data:{
            orderId:order.id,
            status:'CANCELLED'
        }
    })
    res.status(200).json(order)
   } catch (error) {
     throw new NotFoundException('Order not found',ErrorCodes.ORDER_NOT_FOUND)
   } 
}


export const getOrderById = async(req:Request,res:Response)=>{
  try {
    const order =await prismaClient.order.findFirstOrThrow({
        where:{
            id:+req.params.id
        },
        include:{
            Products:true,
            events:true
        }
    })
    res.status(200).json(order)
  } catch (error) {
    throw new NotFoundException('Order not found',ErrorCodes.ORDER_NOT_FOUND)
  }  
}
export const listAllOrders = async(req: Request, res: Response) => {
    let whereClause = {}
    const status = req.query.status
     const skip = parseInt(req.query.skip as string, 10) || 0;
    if (status) {
        whereClause = {
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip:skip,
        take: 5
    })
    res.json(orders)
}

export const changeStatus = async(req: Request, res: Response) => {
    
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        })
        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        })
        res.json(order)
    } catch(err) {
        throw new NotFoundException('Order not found', ErrorCodes.ORDER_NOT_FOUND)
    }
    
}

export const listUserOrders = async(req: Request, res: Response) => {
         const skip = parseInt(req.query.skip as string, 10) || 0;
    let whereClause: any = {
        userId: +req.params.id
    }
    const status = req.params.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: skip,
        take: 5
    })
    res.json(orders)
    
}