import jwt from "jsonwebtoken";
import prisma from "../Db/db.config.js";
const checkAuth=async(req,res,next)=>{
    let token;
    const {authorization}=req.headers;
    if(authorization && authorization.startsWith('Bearer'))
    {
        try {
            //get token
            token=authorization.split(' ')[1];
    //verify Token
    const {admin_id}=jwt.verify(token,process.env.JWT_SECRET_KEY);
    //get Admin from Token
    req.admin=await prisma.admin.findFirst(admin_id);
    next();
        } catch (error) {
            console.log()
            res.status(401).json({ status: 'faild',message:"Unauthorized Access" });
        }
    }
    if(!token)
    {
        res.status(401).json({ status: 'Failed',message:"Unauthorized Admin No Token", });
    }
};
const checkSuperAdminAuth = async (req, res, next) => {
    let token;
    const authorization = req.headers.authorization; // Corrected header extraction
    console.log("Debugging is started");
    console.log("Authorizations = ", authorization);
    
    try {
        if (authorization && typeof authorization === 'string' && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
            console.log("Token only extracted: ", token);
            
            // Verify Token
            const  id  = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("Id ", id);
            
            if (id) {
                next();
            } else {
                res.status(401).json({ status: 'failed', message: "Unauthorized Access" });
            }
        } else {
            res.status(401).json({ status: 'failed', message: "Invalid Authorization Header" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: 'failed', message: "Unauthorized Access" });
    }
};

//Check Teaher auth
const CheckTeacherAuth = async (req, res, next) => {
    let token;
    const authorization = req.headers.authorization;  
    console.log("Debugging is started");
    console.log("Authorizations = ", authorization);
    
    try {
        if (authorization && typeof authorization === 'string' && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
            console.log("Token only extracted: ", token);
            
            // Verify Token
            const  teacher_id  = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("Id ", id);
            
            if (teacher_id) {
                next();
            } else {
                res.status(401).json({ status: 'failed', message: "Unauthorized Access" });
            }
        } else {
            res.status(401).json({ status: 'failed', message: "Invalid Authorization Header" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: 'failed', message: "Unauthorized Access" });
    }
};
export {checkAuth,checkSuperAdminAuth};