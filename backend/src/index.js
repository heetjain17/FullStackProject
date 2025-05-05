import express from "express" 
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import cookieParser from 'cookie-parser'
import problemRoutes from "./routes/problem.routes.js";
import executionRoutes from './routes/executeCode.routes.js'
dotenv.config();
const app = express()

app.use(express.json())
app.use(cookieParser())
   
app.get('/', () => {
    console.log(`Hello guys welcum to LeetLab 🔥`);
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problem', problemRoutes)
app.use('/api/v1/execute-code', executionRoutes)

app.listen(process.env.PORT , () => {
    console.log(`Server is running on 8080`); 
})