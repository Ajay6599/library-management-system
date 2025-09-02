const express = require('express');
const { lmsAuthMiddleware } = require('../Middleware/lmsAuth.middleware');
const { studAdminController } = require('../Controller/stud-admin.controller');

const userRouter = express.Router();

const { authT, authR } = lmsAuthMiddleware;

userRouter.post('/register', studAdminController.register);
userRouter.post('/login', studAdminController.login);

userRouter.put('/me', authT, authR(['Admin', 'Student']), studAdminController.updateBySelf);

userRouter.get('/', authT, authR(['Admin']), studAdminController.getAllStudents);
userRouter.get('/:id', authT, authR(['Admin']), studAdminController.getById);

userRouter.put('/:id', authT, authR(['Admin']), studAdminController.updateByAdmin);

userRouter.delete('/:id', authT, authR(['Admin']), studAdminController.deleteById);

userRouter.get('/user/logout', authT, studAdminController.logout);

module.exports = { userRouter };