import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import routes from './routes/index.js';
import pool from "./config/db.js"; //db config
import './config/passport.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL //frontend URL. Heoku Config Var
}));




app.use(express.json());
app.use(passport.initialize());

//Bruk ruter fra routes/index.js
app.use('/', routes);



//Using whatever PORT Heroku is using. 5000 for local
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});