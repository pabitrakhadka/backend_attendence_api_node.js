import express from 'express';
const  app = express();
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
const port = process.env.PORT || 5000;
import cors from 'cors';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cores Policy
app.use(cors());
// Requiring routes
import routes from './routes/index.js';
app.use(routes);
 
const start = () => {
  try {
    app.listen(port, () => {
      console.log(`${port} Yes, I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
