import express,{Express} from'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'             
import { errorMiddleware } from "./middlewares/errors"


const app:Express=express()

app.use(express.json())

app.use('/api',rootRouter)


export const prismaClient=new PrismaClient({
    log:['query']
}).$extends({
    result:{
        address:{
            formattedAddress:{
                needs:{
                    lineOne:true,
                    lineTwo:true,
                    city:true,
                    state:true,
                    country:true,
                    zipCode:true
                },
                compute:(addr)=>{
                 return `${addr.lineOne},${addr.lineTwo},${addr.city},${addr.state},${addr.country}-${addr.zipCode}`   
                }
            }
        }
    }
})


app.use(errorMiddleware)
 app.listen(PORT,()=>{
    console.log("server is running on port 3000")
 })