import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsEception } from "../exceptions/bad-requests";




interface CustomRequest extends Request {
    user?: any;
}




export const addAddress = async(req:CustomRequest,res:Response)=>{
AddressSchema.parse(req.body)
    const userId = req.user.id
 const address = await prismaClient.address.create({
    data:{
        ...req.body,
        userId:userId
    }
 })
 res.status(201).json(address)
}

export const deleteAddress = async(req:Request,res:Response)=>{
   try {
    await prismaClient.address.delete({
        where:{
            id:+req.params.id
        }
    })
    res.status(200).json({success:"address is successfully deleted"})
   } catch (error) {
    throw new  NotFoundException('Address not found',ErrorCodes.ADDRESS_NOT_FOUND)
   } 
}

export const listAddress = async(req:CustomRequest,res:Response)=>{
    const addresses =await prismaClient.address.findMany({
        where:{
            userId: req.user.id
        }
    })
    res.status(200).json(addresses)
}

export const updateUser =async(req:CustomRequest,res:Response)=>{
    const validatedData=UpdateUserSchema.parse(req.body)
    let ShippingAddress:Address;
    let BillingAddress:Address;
  if(validatedData.defaultShippingAddress){
      try {
        ShippingAddress=await prismaClient.address.findFirstOrThrow({
            where:{
                id:validatedData.defaultShippingAddress
            }
        })
        
    } catch (error) {
       throw new NotFoundException('Address not found',ErrorCodes.ADDRESS_NOT_FOUND) 
    }
            if(ShippingAddress.userId != req.user.id) {
            throw new BadRequestsEception('Address does not belong to user', ErrorCodes.ADDRESS_DOES_NOT_BELONG_TO_USER)
        }

  }

  if(validatedData.defaultBillingAddress){
      try {
        BillingAddress=await prismaClient.address.findFirstOrThrow({
            where:{
                id:validatedData.defaultBillingAddress
            }
        })
    } catch (error) {
       throw new NotFoundException('Address not found',ErrorCodes.ADDRESS_NOT_FOUND) 
    }
      if(BillingAddress.userId != req.user.id) {
            throw new BadRequestsEception('Address does not belong to user', ErrorCodes.ADDRESS_DOES_NOT_BELONG_TO_USER)
        }
  }
  const updatedUser = await prismaClient.user.update({
    where:{
        id:req.user.id
    },
    data:validatedData
  })
  res.status(200).json(updatedUser)
}


export const listUsers = async(req:Request,res:Response)=>{
    const skip = parseInt(req.query.skip as string, 10) || 0;
const users =await prismaClient.user.findMany({
    skip:skip,
    take:5
})
res.status(200).json(users)
}


export const getUserById = async(req:Request,res:Response)=>{
    try {
        const user =await prismaClient.user.findFirstOrThrow({
            where:{
                id:+req.params.id
            },
            include:{
                Address:true
            }
        })
        res.status(200).json(user)
        
    } catch (error) {
      throw new NotFoundException('User not found',ErrorCodes.USER_NOT_FOUND)  
    }
}



export const changeUserRole = async(req:Request,res:Response)=>{
    
      try {
        const user =await prismaClient.user.update({
            where:{
                id:+req.params.id
            },
            data:{
                role:req.body.role
            }
        })
        res.status(200).json(user)
        
    } catch (error) {
      throw new NotFoundException('User not found',ErrorCodes.USER_NOT_FOUND)  
    }
}