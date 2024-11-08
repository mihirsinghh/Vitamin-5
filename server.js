// LIBRARIES NEEDED
const express = require('express');
const app = express();
const mysql = require('mysql2');
const mongoose = require('mongoose');

// SQL CONNECTION
// TO DO: connect to mysql with the host, database, user, and password. 
const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'Tennis0817*',
    database: 'company_database'
});

// MySQL Connection Verification
function verifyMySQLConnection() {
    connection.connect(function(err) {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('MySQL connected as id ' + connection.threadId);
    });
}

// MONGOOSE CONNECTION
// TODO: connect to your local host on the companyDB collection
mongoose.connect('mongodb://localhost: 27017/companyDB', { //connects to a MongoDB database named companyDB running on localhost at port 27017
    useNewURLParser: True, //ensures that Mongoose reads the connection URL correctly
    useUnifiedTopology: True //helps Mongoose connect and stay connected to MongoDB more smoothly by enabling a new way for Mongoose to manage connections to MongoDB
});

// TODO: Mongoose Schema and Model
const ProjectSchema = new mongoose.Schema({ //defines the structure for a MongoDB document in the "projects" collection. In other words, it states that each document in this project will have a "name" field and a "budget" field 
    name: String, //each project will have a "name" field that is a string
    budget: Number //each project will have a "budget" field that is a number
});

const ProjectModel = mongoose.model('Project', ProjectSchema);  //Provides a way to interact with the "projects" collection based on the defined schema

// MongoDB Connection Verification 
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// ENDPOINTS
// Endpoint to get all projects from MongoDB when you enter: http://localhost:3000/projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await ProjectModel.find({});
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Endpoint to get all employees from MySQL when you enter: http://localhost:3000/employees
app.get('/employees', function (req, res) {
    connection.query('SELECT * FROM employees', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

// RUNNING THE SERVER
app.listen(3000, function () {
    console.log('Server is running on port 3000!');
    verifyMySQLConnection();
});