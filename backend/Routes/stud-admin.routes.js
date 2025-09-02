const express = require('express');
const { lmsAuthMiddleware } = require('../Middleware/lmsAuth.middleware');
const { studAdminController } = require('../Controller/stud-admin.controller');
const { canEditOrDeleteUser } = require('../Middleware/canEditOrDeleteUser');

const userRouter = express.Router();

const {authT, authR} = lmsAuthMiddleware;

userRouter.post('/register', studAdminController.register);
userRouter.post('/login', studAdminController.login);
userRouter.get('/', authT, authR(['Admin']), studAdminController.getAllStudents);
userRouter.get('/:id', authT, authR(['Admin']), studAdminController.getById);

userRouter.put('/:id', authT, authR(['Admin', 'Student']), canEditOrDeleteUser, studAdminController.updateById);
userRouter.delete('/:id', authT, authR(['Admin', 'Student']), canEditOrDeleteUser, studAdminController.deleteById);

userRouter.get('/user/logout', authT, studAdminController.logout);

module.exports = { userRouter };