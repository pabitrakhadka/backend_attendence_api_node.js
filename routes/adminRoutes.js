import { Router } from "express";
import prisma from "../Db/db.config.js";
import { hashPassword } from "../controller/superadminController.js";
import {
  CourseSchema,
  teacherSchema,
  CreateClass,
  StudentSchema,
  SubjectSchema,
} from "../validate/index.js";
const router = Router();

//add course
router.post("/course/:id", async (req, res) => {
  try {
    const id = parseInt(req.params?.id);
    const { error, value } = CourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { course_name } = req.body;

    await prisma.course.create({
      data: {
        school_id: id,
        course_name: course_name,
      },
    });

    return res
      .status(200)
      .json({ status: 200, message: "Course is Added Successfully." });
  } catch (error) {
    // Include the error details in the response
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
});

//get course
router.get("/course/:school_id", async (req, res) => {
  try {
    // console.log(req.headers?.authorization);
    const { school_id } = req.params;

    const courses = await prisma.course.findMany({
      where: {
        school_id: parseInt(school_id),
      },
      select: {
        course_id: true,
        course_name: true,
      },
    });

    if (!courses || courses.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }

    res.status(200).json({ data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//add Subject
router.post("/:school_id/:class_name/subject", async (req, res) => {
  try {
    const { error, value } = SubjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { school_id, class_name } = req.params;
    const { subject_name, level } = req.body;

    const schoolIdInt = parseInt(school_id);

    const findSubject = await prisma.subject.findFirst({
      where: {
        school_id: schoolIdInt,
        subject_name: subject_name,
        class_name: class_name,
      },
    });

    if (findSubject) {
      return res
        .status(400)
        .json({
          status: 400,
          message:
            "Subject Name already taken. Please choose another subject name.",
        });
    }

    await prisma.subject.create({
      data: {
        school_id: schoolIdInt,
        subject_name: subject_name,
        class_name: class_name,
        level: level,
      },
    });

    return res
      .status(200)
      .json({ status: 200, message: "Subject is Added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
});
//Get Subject/

//get Subjects
router.get("/course/:school_id", async (req, res) => {
  try {
    // console.log(req.headers?.authorization);
    const { school_id } = req.params;

    const courses = await prisma.course.findMany({
      where: {
        school_id: parseInt(school_id),
      },
      select: {
        course_id: true,
        course_name: true,
      },
    });

    if (!courses || courses.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }

    res.status(200).json({ data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Delete Teacher
router.delete("/teacher/:school_id/:teacherId", async (req, res) => {
  try {
    const { school_id, teacherId } = req.params;

    const DeleteTeacher = await prisma.teacher.delete({
      where: {
        school_id: parseInt(school_id),
        teacher_id: parseInt(teacherId),
      },
    });

    if (DeleteTeacher) {
      return res.status(200).json({ message: "Deleted successfully." });
    } else {
      return res.status(404).json({ message: " Teacher not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//Delete course
router.delete("/course/:school_id/:course_id", async (req, res) => {
  try {
    const { school_id, course_id } = req.params;

    const deletedCourse = await prisma.course.delete({
      where: {
        school_id: parseInt(school_id),
        course_id: parseInt(course_id),
      },
    });

    if (deletedCourse) {
      return res.status(200).json({ message: "Course deleted successfully." });
    } else {
      return res.status(404).json({ message: "Course not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete Class
router.delete("/class/:school_id/:classId", async (req, res) => {
  try {
    const { school_id, classId } = req.params;

    // Delete sections associated with the class
    const deleteSections = await prisma.section.deleteMany({
      where: {
        school_id: parseInt(school_id),
        class_id: parseInt(classId)
      }
    });

    // Now that all associated sections are deleted, delete the class
    const deleteClass = await prisma.classes.delete({
      where: {
        school_id: parseInt(school_id),
        class_id: parseInt(classId)
      }
    });

    if (deleteSections && deleteClass) {
      return res.status(200).json({ message: "Class and associated sections deleted successfully." });
    } else {
      return res.status(404).json({ message: "Class not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



//Add teacher Api
router.post("/teacher/:school_id", async (req, res) => {
  try {
    const { error, value } = teacherSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const school_id = parseInt(req.params?.school_id);
    console.log("schoolid ", school_id);

    const { name, address, phone, email, course, username, password } =
      req.body;

    // Check if the teacher with the given school_id and username already exists
    const findTeacher = await prisma.teacher.findFirst({
      where: {
        school_id: school_id,
        username: username,
      },
    });

    if (findTeacher) {
      return res
        .status(400)
        .json({
          status: 400,
          message: "Username already taken. Please choose another username.",
        });
    }

    // If the teacher does not exist, create a new record
    const addTeacher = await prisma.teacher.create({
      data: {
        school_id: school_id,
        name: name,
        address: address,
        phone: phone,
        email: email,
        course: course,
        username: username,
        password: hashPassword(password),
      },
    });

    return res
      .status(200)
      .json({
        status: 200,
        data: addTeacher,
        message: "Teacher is Added successfully.",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, error: "Internal Server Error" });
  }
});

//get all teacher Api
router.get("/teacher/:school_id", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);

    const teacher = await prisma.teacher.findMany({
      where: {
        school_id: school_id,
      },
    });
    if (!teacher || teacher.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }
    res.status(200).json({ data: teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get teacher Api
router.get("/teacher/:schoolId/:teacherId", async (req, res) => {
  try {
    const {schoolId,teacherId} = parseInt(req.params);
    const teacher = await prisma.teacher.findMany({
      where: {
        school_id :schoolId,
        teacher_id: teacherId
      },
      select:{
        teacher_id:true,
        name:true,
        address:true,
        phone:true,
        email:true,
        course:true,username:true,
      }
    });
    if (!teacher || teacher.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }
    res.status(200).json({ data: teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Upadate Tacher
router.post("/teacher/:school_id/:teacherId", async (req, res) => {
  try {
    const { error, value } = teacherSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {school_id,teacherId} = parseInt(req.params);
     

    const { name, address, phone, email, course, username, password } =
      req.body;

    // Check if the teacher with the given school_id and username already exists
    const findTeacher = await prisma.teacher.findFirst({
      where: {
        school_id: school_id,
        username: username,
      },
    });

    if (!findTeacher) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "Teacher not found.",
        });
    }

    // If the teacher exists, update the record
    const updateTeacher = await prisma.teacher.update({
      where: {
        school_id: school_id,
        username: username,
        teacher_id:teacherId
      },
      data: {
        name: name,
        address: address,
        phone: phone,
        email: email,
        course: course,
        password: hashPassword(password),
      },
    });

    return res
      .status(200)
      .json({
        status: 200,
        data: updateTeacher,
        message: "Teacher information updated successfully.",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, error: "Internal Server Error" });
  }
});

//add Class
router.post("/class/:school_id", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);
    const { error, value } = CreateClass.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { class_name } = req.body;

    // Check if class with the same school_id and class_name exists
    const existingClass = await prisma.classes.findFirst({
      where: {
        school_id: school_id,
        class_name: class_name,
      },
    });

    if (existingClass) {
      return res
        .status(200)
        .json({
          status: 400,
          message:
            "Class name already taken. Please choose another class name.",
        });
    }

    // If not exists, add class to the database
    await prisma.classes.create({
      data: {
        school_id: school_id,
        class_name: class_name,
      },
    });

    return res
      .status(200)
      .json({ status: 200, message: "Class is added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

//get Class
router.get("/:school_id/class", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);

    const className = await prisma.classes.findMany({
      where: {
        school_id: school_id,
      },
    });
    if (!className || className.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }
    res.status(200).json({ data: className });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:school_id/:classId/section", async (req, res) => {
  try {
    const { school_id, classId } = req.params;

    const sections = await prisma.section.findMany({
      where: {
        school_id: parseInt(school_id),
        class_id: parseInt(classId)
      },
    });

    if (!sections || sections.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }

    res.status(200).json({ data: sections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//add student
router.post("/:school_id/student", async (req, res) => {
  try {
    const { error, value } = StudentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const school_id = parseInt(req.params.school_id);
    const {
      name,
      class_id,
      address,
      section_id,
      phone,
      father_name,
      father_phone,
    } = req.body;
    const findStudent = await prisma.student.findFirst({
      where: {
        school_id: school_id,
        name: name,
        class_id: parseInt(class_id),
        address: address,
        section: parseInt(section_id),
        phone: phone,
        father_name: father_name,
        father_phone: father_phone,
      },
    });
    if (findStudent) {
      return res
        .status(400)
        .json({
          message:
            "Student name already Exists. Please choose another Student record",
        });
    }
    await prisma.student.create({
      data: {
        school_id: school_id,
        name: name,
        class_id: parseInt(class_id),
        address: address,
        section: parseInt(section_id),
        phone: phone,
        father_name: father_name,
        father_phone: father_phone,
      },
    });
    return res
      .status(200)
      .json({ status: 200, message: "Student is added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//api to serarch Student
router.get("/:school_id/search", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);  
    if (isNaN(school_id)) {
      return res.status(400).json({ error: "Invalid school_id" });
    }
    const { name, class_id, section_id } = req.body;
    const searchQuery = {
      where: {
        school_id: school_id,
        name: { contains: name },
        class_id:parseInt(class_id),
        section:parseInt(section_id)  
      },
    };
    const searchResults = await prisma.student.findMany(searchQuery);
    res.status(200).json({ data: searchResults });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//get count Total student
router.get("/:school_id/totalstudent", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);

    const totalStudents = await prisma.student.count({
      where: {
        school_id: school_id,
      },
    });

    return res.status(200).json({ title: "Total Student", totalStudents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//get count Total Teacher
router.get("/:school_id/totalteacher", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);

    const totalTeacher = await prisma.teacher.count({
      where: {
        school_id: school_id,
      },
    });

    return res.status(200).json({ title: "Total Teacher", totalTeacher });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//get count Total Class
router.get("/:school_id/totalclass", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);

    const totalClass = await prisma.classes.count({
      where: {
        school_id: school_id,
      },
    });

    return res.status(200).json({ title: "Total Class", totalClass });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add Section
router.post("/section/:adminId/:classId", async (req, res) => {
    try {
      const { section_name } = req.body; // Corrected line
      const { adminId, classId } = req.params;
      const checkSection = await prisma.section.findFirst({
        where: {
          school_id: parseInt(adminId),
          class_id: parseInt(classId),
          name: section_name, // Using the extracted name here
        },
      });
      if (!checkSection) {
        await prisma.section.create({
          data: {
            school_id: parseInt(adminId), // Ensure you parse integers here if needed
            class_id: parseInt(classId), // Ensure you parse integers here if needed
            name: section_name, // Using the extracted name here
          },
        });
        return res.status(200).json({ message: "Section Added!" });
      } else {
        return res
          .status(200)
          .json({ message: "Section Name is Already Exists!" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
          error: "Internal Server Error",
          message: "Internal Server Error",
        });
    }
  });
  //get Section where class/
  router.get('/section/:adminId/:class_id', async (req, res) => {
    try {
      const { adminId, class_id } = req.params;
      const selectSection = await prisma.section.findMany({
        where: {
          school_id: parseInt(adminId),
          class_id: parseInt(class_id)
        },
        select: {
          section_id: true,
          name: true
        }
      });
      res.status(200).json({ message: "Successful Get Data", selectSection });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Internal Server Error"
      });
    }
  });
  
export default router;
