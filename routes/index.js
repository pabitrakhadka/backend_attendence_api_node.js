import Router from "express";
const router=Router();
import superAdminRouter from './superadmin.js';
import auth from './auth.js';
import adminRouter from './adminRoutes.js';
import {checkSuperAdminAuth} from '../Middleware/auth-middleware.js';
import teacherRouter from './teacher.js';

//MiddleWare
// const middleware=(req,res,next)=>{
//     console.log("Hello my middle ware");
// }

//Protected Route
router.use('/api/auth/superadmin/token/:id',checkSuperAdminAuth),
router.use('/api/auth',auth);
router.use('/api/superadmin',superAdminRouter);
router.use('/api/admin',adminRouter);
router.use('/api/teacher',teacherRouter);

export default router;