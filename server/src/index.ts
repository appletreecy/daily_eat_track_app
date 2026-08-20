import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import mealRoutes from './routes/mealRoutes';
import summaryRoutes from './routes/summaryRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({status: 'ok', message: 'Server and database are running!'});
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({status: 'error', message: 'Server or database is not running!'});
    }
});

app.use('/api/meals', mealRoutes);
app.use('/api/summary', summaryRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Health check endpoint: http://localhost:${PORT}/api/health`)
})

export default app;

