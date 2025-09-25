import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js'
import ratelimiter from './middleware/rateLimiter.js'
import transactionsRoute from './routes/transactionsRoute.js'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5001

app.use(ratelimiter)
app.use(express.json())

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log('Database connected')
    } catch (error) {
        console.log("Error initialising it",error)
        process.exit(1)
    }
}

app.get("/api/transactions", transactionsRoute)

initDB().then(()=> {
    app.listen(PORT, ()=>{
    console.log('listening on port',PORT)
})
})

