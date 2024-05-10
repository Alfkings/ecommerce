import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/users";
import { errorHandler } from "../../error-handler";
import adminMiddleware from "../middlewares/admin";

const usersRoutes:Router =Router()


usersRoutes.post('/address',[authMiddleware],errorHandler(addAddress))

usersRoutes.delete('/address/:id',[authMiddleware],errorHandler(deleteAddress))

usersRoutes.get('/address',[authMiddleware],errorHandler(listAddress))

usersRoutes.put('/',[authMiddleware],errorHandler(updateUser))


usersRoutes.put('/:id/role',[authMiddleware,adminMiddleware],errorHandler(changeUserRole))


usersRoutes.get('/role',[authMiddleware,adminMiddleware],errorHandler(listUsers))

usersRoutes.get('/role/:id',[authMiddleware,adminMiddleware],errorHandler(getUserById))




export default usersRoutes