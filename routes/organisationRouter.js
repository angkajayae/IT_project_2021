const express = require('express');
const organisationRouter = express.Router();

// require the organisation controller
var organisationController = require('../controllers/organisationController');

//GET request to get one organisation
organisationRouter.get('/organisation/:id', organisationController.getOne)

//GET request to get all organisation
organisationRouter.get('/organisation/all', organisationController.getAll)

//POST request to create a new organisation
organisationRouter.post('/organisation/create', organisationController.createOne)

//POST request to delete a organisation
organisationRouter.post('/organisation/delete/:id', organisationController.deleteOne)

// export the router
module.exports = organisationRouter;