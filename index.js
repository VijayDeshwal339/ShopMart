const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const app = express();
const Connectdb = require('./config/db'); // Updated import
const route = require('./Routes/route.js');
const cors = require('cors');



//configure env
dotenv.config();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true}));
app.use('/api/v1',route);

//databse config
Connectdb();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
