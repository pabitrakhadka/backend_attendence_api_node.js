import { Router } from "express";
import prisma from "../Db/db.config.js";
// Import hashPassword using ES module syntax
import jwt from "jsonwebtoken";
import {
  hashPassword,
  verifyPassword,
} from "../controller/superadminController.js";
const router = Router();
// Set up session middleware

import {
  SuperAdminSchemaLogin,
  adminLoginSchema,
  teacherSchema,
} from "../validate/index.js";

//super admin login
router.post("/superadmin/login", async (req, res) => {
  try {
    const { error, value } = SuperAdminSchemaLogin.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    // Use Prisma to interact with the database
    const findSuperAdmin = await prisma.superAdmin.findUnique({
      where: { username: username },
    });

    if (!findSuperAdmin || !verifyPassword(password, findSuperAdmin.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    let token;
    // Check if the user has a token in the database
    if (!findSuperAdmin.token) {
      // Generate a new token
      token = jwt.sign(
        { userId: findSuperAdmin.id, username: findSuperAdmin.username },
        process.env.JWT_SECRET_KEY,
        
      );
      // Update user's token in the database
      await prisma.superAdmin.update({
        where: { id: findSuperAdmin.id },
        data: { token: token },
      });
    } else {
      // Use the existing token
      token = findSuperAdmin.token;
    }

    return res
      .status(200)
      .json({
        message: "Login successful",
        token: token,
        id: findSuperAdmin.id,
        name: findSuperAdmin.name,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//admin login
router.post("/admin/login", async (req, res) => {
  try {
    const { error, value } = adminLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    // Use Prisma to interact with the database
    const findAdmin = await prisma.admin.findUnique({
      where: { username: username },
    });

    if (!findAdmin || !verifyPassword(password, findAdmin.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    let token;
    // Check if the user has a token in the database
    if (!findAdmin.token) {
      // Generate a new token
      token = jwt.sign(
        { userId: findAdmin.id, username: findAdmin.username },
        process.env.JWT_SECRET_KEY,
       
      );
      // Update user's token in the database
      await prisma.admin.update({
        where: { id: findAdmin.id },
        data: { token: token },
      });
    } else {
      // Use the existing token
      token = findAdmin.token;
    }

    return res
      .status(200)
      .json({
        message: "Login Successful",
        token: token,
        id: findAdmin.id,
        name: findAdmin.school_name,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Teacher Login
router.post("/teacher/login", async (req, res) => {
  try {
    const { error, value } = SuperAdminSchemaLogin.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    // Use Prisma to interact with the database
    const findTeacher = await prisma.teacher.findUnique({
      where: { username: username },
    });

    if (!findTeacher || !verifyPassword(password, findTeacher.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let token;
    // Check if the user has a token in the database
    if (!findTeacher.token) {
      // Generate a new token
      token = jwt.sign(
        { userId: findTeacher.teacher_id, username: findTeacher.username },
        process.env.JWT_SECRET_KEY,
        
      );

      // Update teacher token in the database
      await prisma.teacher.update({
        where: { teacher_id: findTeacher.teacher_id },
        data: { token: token },
      });
    } else {
      // Use the existing token
      token = findTeacher.token;
    }

    return res
      .status(200)
      .json({
        message: "Login Successful",
        token: token,
        id: findTeacher.teacher_id,
        name: findTeacher.username,
        schoolId: findTeacher.school_id,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//forgot password admin||teacher|| reset password
//check phonenumber exist or not
router.get("/forgot/:role", async (req, res) => {
  try {
    const role = req.params?.role;
    const { username,phone } = req.body;
     

    if (role == "admin") {
      const findAdminId = await prisma.admin.findFirst({
        where: {
          username:username,
          phone: phone,
        },
        select: {
          id: true,
        },
      });

      if (findAdminId) {
        return res.status(200).json({ message: "Find Phone", id: findAdminId.id });
      } else {
        return res.status(400).json({ message: "Phone Number is not exits" });
      }
    } else if (role == "teacher") {
      const findTeacherId = await prisma.teacher.findFirst({
        where: {
          phone: phone,
        },
        select: {
          teacher_id: true,
        },
      });

      if (findTeacherId) {
        return res.status(200).json({ message: "Find Phone", id: findTeacherId.teacher_id });
      } else {
        return res.status(400).json({ message: "Phone Number is not exits" });
      }
    } else {
      return res.status(500).json({ message: "Unauthorized Access" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Forgot password Update password in database ||update password admin|teacher
router.post("/:role/forgotpassword/:id", async (req, res) => {
  try {
    const { role, id } = req.params;
    
    if (role && id) {
      console.log(role, id);
      const { password } = req.body;
      
      // Parse 'id' separately
      const parsedId = parseInt(id, 10);

      if (role === "admin") {
        await prisma.admin.update({
          where: {
            id: parsedId,
          },
          data: {
            password: hashPassword(password),
          },
        });
        return res.status(200).json({ message: "Successful Reset Password" });
      } else if (role === "teacher") {
        await prisma.teacher.update({
          where: {
            teacher_id: parsedId,
          },
          data: {
            password: hashPassword(password),
          },
        });
        return res.status(200).json({ message: "Successful Reset Password" });
      }
    } else {
      return res.status(500).json({ message: "Unauthorized Access" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unauthorized Access" });
  }
});


//Logout SuperAdmin /delete token superadmin
router.delete("/superadmin/token/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Use Prisma to delete the token for the specified superadmin ID
    const deletedSuperAdmin = await prisma.superAdmin.update({
      where: { id: parseInt(id) },
      data: { token: null }, // Set the token to null to remove it
    });
    res
      .status(200)
      .json({ message: "Logout Successfully", data: deletedSuperAdmin });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Log OUt Admin
router.delete("/admin/token/:id", async (req, res) => {
  try {
    const id = parseInt(req.params?.id);
    console.log(id);
    // Use Prisma to delete the token for the specified superadmin ID
    const deleteAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: { token: null }, // Set the token to null to remove it
    });
    res
      .status(200)
      .json({ message: "Logout Successfully", data: deleteAdmin });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Logout teacher /delete token teacher
router.delete("/teacher/token/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Use Prisma to delete the token for the specified superadmin ID
    const deleteTeacher = await prisma.teacher.update({
      where: { teacher_id: parseInt(id) },
      data: { token: null }, // Set the token to null to remove it
    });
    res
      .status(200)
      .json({ message: "Logout Successfully", data: deleteTeacher });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
