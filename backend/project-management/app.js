require("dotenv").config();

const express = require('express');
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
const cloudRoutes = require('./routes/cloudRoutes');
const projectRoutes = require('./routes/projectRoutes');
const sequelize = require('./database/connection');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Initialize Sequelize connection
sequelize.authenticate()
  .then(() => {
    sequelize.sync({ alter: true }) // Set alter: true to alter tables to match model definitions
    .then(() => {
      console.log('Database synchronized successfully');
    })
    .catch(error => {
      console.error('Error synchronizing database:', error);
    });
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Middleware
app.use(express.json());
app.use(cors());

app.options("*", function (req, res, next) {
  console.log("inside this");
  res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});



// Routes
app.use(userRoutes);
app.use(projectRoutes);
app.use(cloudRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
