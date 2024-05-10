import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";



interface CustomRequest extends Request {
    user?: any;
}


export const addItemToCart =async(req:CustomRequest,res:Response)=>{
const validatedData =CreateCartSchema.parse(req.body)
let product:Product;
try {
    product = await prismaClient.product.findFirstOrThrow({
        where:{
            id:validatedData.productId
        }
    })
} catch (error) {
    throw new NotFoundException('product not found !',ErrorCodes.PRODUCT_NOT_FOUND)
}
const cart = await prismaClient.cart.create({
    data:{
        userId:req.user.id,
        productId:product.id,
        quantity:validatedData.quantity
    }
})
res.status(201).json(cart)
}



export const deleteItemFromCart =async(req:Request,res:Response)=>{
await prismaClient.cart.delete({
    where:{
        id:+req.params.id
    }
})
res.status(200).json({
    message:'item deleted successfully'
})
}




export const changeQuantity =async(req:Request,res:Response)=>{
const validatedData=ChangeQuantitySchema.parse(req.body)
const updatedCart = await prismaClient.cart.update({
    where:{
        id:+req.params.id
    },
    data:{
        quantity:validatedData.quantity
    }
})
res.status(200).json(updatedCart)
}




export const getCart =async(req:CustomRequest,res:Response)=>{
  const cart =await prismaClient.cart.findMany({
    where:{
        userId:req.user.id
    },
    include:{
        product:true
    }
  })
  res.status(200).json(cart)
}