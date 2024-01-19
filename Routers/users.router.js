const userRouter = require('express').Router();
const { getAllUsers, getUserByUsername } = require('../db/Controllers/controller')

userRouter.get('/', getAllUsers);

userRouter.get('/:username', getUserByUsername);

module.exports = userRouter;