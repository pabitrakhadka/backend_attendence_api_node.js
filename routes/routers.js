const express = require("express");
const router = express.Router();
const db = require("../conectdb.js");
const jwt=require("jsonwebtoken");
const {SuperAdminSchemaLogin,adminSchema,teacherSchema,StudentSchema,AdminsearchStudent,CreateClass,CourseSchema,SubjectSchema,AttendenceSchema} = require('../validate/index.js');

 

//Super Admin API GET
//get all student count
router.get("/students/count",(req,res)=>{
  const query="SELECT COUNT(*) AS total_students FROM students";
  db.query(query,(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.length>0)
      {
        res.status(200).json({ status: true, message: "Successfult", data: result });
      }
    }
  })
})
router.get('/superadmin/:id', (req, res) => {
  const id = req.params.id;
  const query = "select superadmin_id from super_admin where superadmin_id=?";
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ status: false, message: "Error executing query" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ status: true, message: "Successfult", "data": result });
      }
      else {
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
});
//Super Admin API PUT
router.put("admin/:id", (req, res) => {
  const id = req.params.id;
  const query = "select admin_id from admin_data where admin_id=?";
  db.query(query, (error, result) => {
    if (error) {
      res.send(500).json({})
    }
  })
});
//Admin API Get
router.get("/admin", (req, res) => {
  const query = "select * from admin_data";
  db.query(query, (error, result) => {
    if (error) {
      res.status(500).json({ status: false, message: "Error executing query" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ status: true, message: "Successfult", "data": result });
      } else {
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
});
router.get("admin/:id");
//Admin API POST
router.post("/admin/", (req, res) => {
  const { error, value } = adminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {name,phone,email,address, username, password } = req.body; // Extract username and password from the request body
  console.log(name,phone,email,address, username, password );

  const query =
  "INSERT INTO `admin_data`(`name`, `email`, `phone`, `address`, `username`, `password`) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(query, [name,email,phone,address, username, password ], (error, result) => {
    if (error) {
      console.log("Error Executing Query");
      res.status(500).json({
        status: false,
        message: "Error occurred",
      });
    } else {
      if (!error && result.affectedRows > 0) {
        res.status(200).json({
          status: true,
          message: "Successful Added",
           
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
    // Ensure there's no other code attempting to send a response after this point
  });
});
//Admin API PUT

router.delete("/admin/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM `admin_data` WHERE admin_id=?";
  db.query(query, [id], (error, result) => {
    if (error) {
      res.status(500).json({ status: false, message: "Error occurred while deleting admin" });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ status: true, message: "Admin deleted successfully" });
      } else {
        res.status(404).json({ status: false, message: "Admin not found" });
      }
    }
  });
});

router.post("/addsubjects", (req, res) => {
  const { error, value } = SubjectSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {subject_name,level,class_name } = req.body; // Extract username and password from the request body
 

  const query =
  "INSERT INTO `subjects`(`subject_name`, `class`, `level`) VALUES (?,?,?)";

  db.query(query, [subject_name,class_name,level ], (error, result) => {
    if (error) {
      console.log("Error Executing Query");
      res.status(500).json({
        status: false,
        message: "Error occurred",
      });
    } else {
      if (!error && result.affectedRows > 0) {
        res.status(200).json({
          status: true,
          message: "Successful Added",
           
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
    // Ensure there's no other code attempting to send a response after this point
  });
});
router.post("admin/:id");
//Admin API DELET
router.delete("/admin");
router.delete("admin/:id");

router.get('/:className/subjects/school', (req, res) => {
  const { className } = req.params;
  const query = 'select * from subjects where level="NEB" and class=?';

  db.query(query, [className], (error, result) => {
    if (error) {
      res.status(500).json({ status: false, message: "Error executing query" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ status: true, message: "Successful", data: result });
      } else {
        res.status(200).json({ status: false, message: "No Record found" });
      }
    }
  });
});
//Teacher Attendence GET API
router.get("/:className/school/attendence",(req,res)=>{
  const {className}=req.params;
  const query = "SELECT * FROM `students` WHERE class_name=?";

  db.query(query, [className], (error, result) => {
    if (error) {
      res.status(500).json({ status: false, message: "Error executing query" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ status: true, message: "Successful", data: result });
      } else {
        res.status(200).json({ status: false, message: "No Record found" });
      }
    }
  })
});
//Teacher Attendence POST API
router.post("/:className/:subject/school/attendence",(req,res)=>{
const {className,subject_name}=req.params;
db.query(query, [className,subject_name], (error, result) => {
    if (error) {
      console.log("Error Executing Query");
      res.status(500).json({
        status: false,
        message: "Error occurred",
      });
    } else {
      if (!error && result.affectedRows > 0) {
        res.status(200).json({
          status: true,
          message: "Successful Attendence",
           
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
     
  })
});
//Teacher API POST
router.post("/teacher/login", (req, res) => {
  const { error, value } = SuperAdminSchemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, password } = req.body; // Extract username and password from the request body

  const query =
    "SELECT teacher_id,name FROM teachers WHERE username=? AND password=?";
  db.query(query, [username, password], (error, result) => {
    if (error) {
      console.log("Error Executing Query");
      res.status(500).json({
        status: false,
        message: "Error occurred",
      });
    } else {
      if (result.length > 0) {
        const user = result[0]; // Use 'result' instead of 'results'
        // Generate a JWT token
        const token = jwt.sign({ userId: user.teacher_id }, 'secretKey');
        res.status(200).json({
          status: true,
          message: "Successful login",
          data: token,
          result:result
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
    // Ensure there's no other code attempting to send a response after this point
  });
});

//app teacher add post
router.post("/teacher/", (req, res) => {
  const { error, value } = teacherSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {name,address,phone,email,course, username, password } = req.body; // Extract username and password from the request body
  

  const query ="INSERT INTO `teachers`(`name`, `address`, `phone`, `email`, `course`, `username`, `password`) VALUES (?,?,?,?,?,?,?)";

  db.query(query, [name,address,phone,email,course, username, password], (error, result) => {
    if (error) {
      console.log("Error Executing Query");
      res.status(500).json({
        status: false,
        message: "Error occurred",
      });
    } else {
      if (!error && result.affectedRows > 0) {
        res.status(200).json({
          status: true,
          message: "Successful Added",
           
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
    // Ensure there's no other code attempting to send a response after this point
  });
});


//Admin
// create class
router.post('/addClass', (req, res) => {
  const { error, value } = CreateClass.validate(req.body);
  if (error) {
    return res.status(400).json({ "message":  error.details[0].message });
  }

  const {school_id, class_name } = req.body;
  const query = "INSERT INTO `classes` (`school_id`,`class_name`) VALUES (?,?)";

  db.query(query, [school_id,class_name], (error, result) => {
    if (error) {
      console.log("Error executing query:", error);
      return res.status(500).json({
        status: false,
        message: "Error occurred while adding class",
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Successfully added class",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to add class",
      });
    }
  });
});

//Delete class
router.delete('/classes/:id', (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM `classes` WHERE class_id=?";
  
  db.query(query, [id], (error, result) => {
    if (error) {
      res.status(500).json({ status: false, message: "Error executing query" });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ status: true, message: "Successfully deleted class" });
      } else {
        res.status(200).json({ status: false, message: "No record found or deleted" });
      }
    }
  });
});

router.post("teacher");
//Teacher API GET
router.get("/teacher", (req, res) => {
  const query = "select * from teachers";
  db.query(query, (error, result) => {
    if (error) {
      res.status(500).json({ status: false, message: "Error executing query" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ status: true, message: "Successfult", "data": result });
      } else {
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
});


//Get all Classes
router.get("/classes",(req,res)=>{
const query='select * from classes';
db.query(query,(error,result)=>{
  if(error)
  {
    res.status(500).json({ status: false, message: "Error executing query" });
  }else{
    if(result.length>0)
    {
      res.status(200).json({ status: true, message: "Successful", "data": result });
    }else{
      res.status(200).json({ status: false, message: "No Record found", });
    }
  }
})
});
//Add More Classes
router.post("/class",(req,res)=>{
  const {school_id,class_name}=req.body;
  const query="INSERT INTO `classes` (`school_id`, `class_name`)VALUES(?,?) ";
  db.query(query,[school_id,class_name],(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.length>0)
      {
        res.status(200).json({ status: true, message: "Successfult Added Class"});
      }else{
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
})


//add course
router.post("/addcourse",(req,res)=>{
  const {error,values}=CourseSchema.validate(req.body);
  if(error)
  {
    return res.status(400).json({ "message":  error.details[0].message });
  }
  const {course_name}=req.body;
  const query="insert into course (course_name) values(?)";
  db.query(query,[course_name],(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.affectedRows>0)
      {
        res.status(200).json({ status: true, message: "Successfult Added Course"});
      }else{
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
});

//get all course course
router.get("/course",(req,res)=>{
  const query="SELECT  * FROM course;";
  db.query(query,(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.length>0)
      {
        res.status(200).json({ status: true, message: "Successfult",data:result});
      }else{
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
});

//attendence post api students
router.post("/mark-attendance",(req,res)=>{
  const {error,values}=AttendenceSchema.validate(req.body);
  if(error)
  {
    return res.status(400).json({ "message":  error.details[0].message });
  }
  const {class_name,subject_name,teacher_id,student_id,present}=req.body;
  const query="INSERT INTO `attendences`(`class`, `subject`, `teacher_id`, `student_id`, `present`) VALUES (?,?,?,?,?)"
  db.query(query,[class_name,subject_name,teacher_id,student_id,present ? 1 : 0],(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.affectedRows>0)
      {
        res.status(200).json({ status: true, message: "Successfull Attendence"});
      }else{
        res.status(200).json({ status: false, message: "No Record found", });
      }
    }
  })
})
router.get("/teacher:id");
//Teacher API PUT
router.put('teacher:id');
//Teacher API Delete
router.put('teacher');
router.put('teacher:id');
//Student API POST
//add student post api
router.post("/student",(req,res)=>{
  const { error, value } = StudentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: false, message: error.details[0].message }); 
  }
const {name,class_name,address,section,phoneNumber,father_name,father_phone}=req.body;
const query = "INSERT INTO `students`(`name`, `class_name`, `address`, `section`, `phone`, `father_name`, `father_phone`) VALUES (?,?,?,?,?,?,?)";

db.query(query,[name,class_name,address,section,phoneNumber,father_name,father_phone],(error,result)=>{
  if(error)
  {
    res.status(500).json({ status: false, message: "Error executing query" });
  }else
  {
    if(result.affectedRows>0)
    {
      res.status(200).json({ status: true, message: "Success Added Student"});
    }else
    {
      res.status(200).json({ status: false, message: "Error", });
    }
  }
})
});
//Teacher API GET
router.get('/student',(req,res)=>{
  const query="select * from students";
  db.query(query,(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.length>0)
      {
        res.status(200).json({ status: true, message: "Success Added Student","data":result});
      }else{
        res.status(200).json({ status: false, message: "No Record Found", });
      }
    }
  })
});
router.get("/student:id");
//student API PUT
router.put('student:id');
//student API Delete
router.put('student');
router.put('student:id');
//search student 
router.get("/searchstudent",(req,res)=>{
  const { error, value } = AdminsearchStudent.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {name,class_name}=req.body;
  const query="select * from students where name=? and class_name=?";
  db.query(query,[name,class_name],(error,result)=>{
    if(error)
    {
      res.status(500).json({ status: false, message: "Error executing query" });
    }else{
      if(result.length>0)
      {
        res.status(200).json({ status: true, message: "Fetch data Succesful","data":result});
      }else{
        res.status(200).json({ status: false, message: "No Record Found", });
      }
    }
  }
  )
})



module.exports = router;
