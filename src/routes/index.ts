import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import usersRoutes from "./users";
import cartRoutes from "./cart";
import orderRoutes from "./orders";

const rootRouter:Router=Router()

rootRouter.use('/auth',authRoutes)

rootRouter.use('/product',productRoutes)

rootRouter.use('/users',usersRoutes)

rootRouter.use('/carts',cartRoutes)

rootRouter.use('/orders',orderRoutes)



export default rootRouter;