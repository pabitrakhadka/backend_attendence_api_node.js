import { Router } from "express";
import prisma from "../Db/db.config.js";
// Import hashPassword using ES module syntax
 
import { hashPassword, verifyPassword } from '../controller/superadminController.js';
const router = Router();
// Set up session middleware
 
import {SuperAdminCreate,addadminSchema}from '../validate/index.js';
import { checkSuperAdminAuth } from "../Middleware/auth-middleware.js";
// Admin API Get

//Add school/or Addmin
router.post('/add/school',async(req,res)=>{
  try {
    const { error, value } = addadminSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const{schoolName,schoolAddress,email,phone,username,password}=req.body;
    console.log(schoolName,schoolAddress,email,phone,username,password);
    const findAddAdminUserName= await prisma.admin.findUnique({
      where:{
        username:username
      }
    })
    if (findAddAdminUserName) {
      return res.status(400).json({ status: 400, message: "Username already taken. Please choose another username." });
    }
    // const token=await generateToken();

    const addAdmin = await prisma.admin.create({
      data: {
        school_name: schoolName,
        schoolAddress:schoolAddress,
        email: email,
        phone: phone,
        username: username,
        password:  hashPassword(password),
      },
    });
    
    return res.status(200).json({ status: 200, data: addAdmin, message: "Admin is Added successfully." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
});
//Create a SuperAdmin add superadmin
router.post('/add', async (req, res) => {
  try {
    const { error, value } = SuperAdminCreate.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, phone, username, password } = req.body;

    // Check if the username already exists
    const findSuperAdmin = await prisma.superAdmin.findUnique({
      where: {
        username: username,
      },
    });

    if (findSuperAdmin) {
      return res.status(400).json({ status: 400, message: "Username already taken. Please choose another username." });
    }
    // Create the superadmin
    const superadmin = await prisma.superAdmin.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        username: username,
        password:  hashPassword(password),
      },
    });

    return res.status(200).json({ status: 200, data: superadmin, message: "Admin is created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
});

//delete Admin data : School Table
 
//super admin get All admin/school
router.get("/school",async(req,res)=>{
try {
  const data = await prisma.admin.findMany();
  if (!data || data.length === 0) {
    return res.status(200).json({ message: 'No Record Found' });
  }
   
  res.status(200).json({ data: data });
} catch (error) {
  console.log(error);
}
});
//count total school or admin
router.get("/totalschool",checkSuperAdminAuth, async (req, res) => {
  try {
      const totalSchool = await prisma.admin.count ();
      return res.status(200).json({ title:"Total School", totalSchool });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/:id/profile", async (req, res) => {
  try {
    const id = parseInt(req.params?.id);
console.log("id= ",id);
    
    const profile = await prisma.superAdmin.findMany({
      where: {
        id: id,
      },
      select: {
        email: true,
        phone: true,
      },
    });
    if (profile.length > 0) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ error: "Profile not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;