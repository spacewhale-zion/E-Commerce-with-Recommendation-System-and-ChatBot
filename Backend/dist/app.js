import express from 'express';
import {connectDB} from "./utils/features.js";

const app = express();
const port = process.env.PORT || 3000;
const mongoURI ="mongodb://localhost:27017"|| "";


// Middleware to parse JSON bodies
app.use(express.json());
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express + TypeScript!' });
});
connectDB(mongoURI);

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
