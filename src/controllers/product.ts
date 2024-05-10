import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createProduct =async(req:Request,res:Response)=>{

const product = await prismaClient.product.create({
    data:{
        ...req.body,
        category:req.body.category.join(',')
    }
})
res.status(201).json(product)

}

export const updateProduct = async(req:Request,res:Response)=>{
try {
    const product =req.body;
    if(product.category){
        product.category = product.category.join(',')
    }
    const updatedProduct = await prismaClient.product.update({
         where:{
            id: +req.params.id
         },
         data:product
    })
    res.status(200).json(updatedProduct)
} catch (error) {
    throw new NotFoundException('Product not found',ErrorCodes.PRODUCT_NOT_FOUND)
}
}


export const deleteProduct = async(req:Request,res:Response)=>{
try {
        const deleteProduct= await prismaClient.product.delete({
        where:{
            id: +req.params.id
        }
    })
    res.status(200).json(deleteProduct)
} catch (error) {
   throw new NotFoundException('Product not found',ErrorCodes.PRODUCT_NOT_FOUND) 
}


}


export const listProducts = async(req:Request,res:Response)=>{
const count = await prismaClient.product.count()

  const skip = parseInt(req.query.skip as string, 10) || 0;

const listProduct = await prismaClient.product.findMany({
   
    skip: skip,
    take:5
})
res.status(200).json({
    count,
    data:listProduct
})
}


export const getProductById = async(req:Request,res:Response)=>{
try {
    const productById =await prismaClient.product.findFirstOrThrow({
        where:{
            id: +req.params.id
        }
    })
    res.status(200).json(productById)
    
} catch (error) {
    throw new NotFoundException('Product not found',ErrorCodes.PRODUCT_NOT_FOUND)
}
}

export const searchProducts =async(req:Request,res:Response)=>{

    const products =await prismaClient.product.findMany({
        where:{
            name:{
                search:req.query.q?.toString()
            },
            description:{
                search:req.query.q?.toString()
            },
            category:{
                search:req.query.q?.toString()
            }

        }
    })
    res.status(200).json(products)
}