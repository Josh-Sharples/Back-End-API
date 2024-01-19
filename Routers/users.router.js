const userRouter = require('express').Router();
const { getAllUsers } = require('../db/Controllers/controller')

userRouter.get('/', getAllUsers);



module.exports = userRouter;