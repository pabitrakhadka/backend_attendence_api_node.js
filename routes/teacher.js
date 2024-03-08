import express from "express";
import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../Db/db.config.js";
import date from "date-and-time";

//const {} = require('../validate/index.js');
//Teacher Admin API Get
const teacher = Router();

//Get Class List
teacher.get("/:school_id/class", async (req, res) => {
  try {
    const { school_id } = req.params;

    const classList = await prisma.classes.findMany({
      where: {
        school_id: parseInt(school_id),
      },
      select: {
        class_id: true,
        class_name: true,
      },
    });

    if (!classList || classList.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }

    res.status(200).json({ data: classList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//get Subject  List
teacher.get("/:school_id/:class_name/", async (req, res) => {
  try {
    const { school_id, class_name } = req.params;

    const subject = await prisma.subject.findMany({
      where: {
        school_id: parseInt(school_id),
      },
      select: {
        subject_id: true,
        subject_name: true,
      },
    });

    if (!subject || subject.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }

    res.status(200).json({ data: subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get Student Section: LIst
teacher.get("/:school_id/:class_id/:sectionId/students", async (req, res) => {
  try {
    const { school_id, class_id,sectionId} = req.params;

    const students = await prisma.student.findMany({
      where: {
        school_id: parseInt(school_id),
        class_id: parseInt(class_id),
        section:parseInt(sectionId)
      },
      select: {
        student_id: true,
        name: true,
        address: true,
        father_name: true,
        father_phone: true,
        school_id: true,
      },
    });

    if (!students || students.length === 0) {
      return res.status(200).json({ message: "No Record Found" });
    }

    res.status(200).json({ data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//take attendence|| Save Attendence Data in Database:
// Express route to handle attendance recording
teacher.post("/attendance/:school_id/:class_id/:teacher_id/:subject",
  async (req, res) => {
    const { school_id, class_id, teacher_id, subject } = req.params;
    const attendanceData = req.body;

    try {
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const dayOfWeek = now.getDay(); // Fix: Call getDay() on the Date object
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[dayOfWeek];

      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          school_id: parseInt(school_id),
          class_id: parseInt(class_id),
          teacher_id: parseInt(teacher_id),
          subject: subject,
          date: formattedDate,
        },
      });

      if (existingAttendance) {
        res
          .status(200)
          .json({
            message: "Attendance already recorded for this date and subject",
          });
      } else {
        // Record new attendance
        const createMany = attendanceData.map((entry) => ({
          school_id: parseInt(school_id),
          class_id: parseInt(class_id),
          teacher_id: parseInt(teacher_id),
          subject: subject,
          student_id: entry.student_id,
          is_present: entry.isPresent ? "P" : "A",
          date: formattedDate,
          day: dayName,
        }));

        await prisma.attendance.createMany({
          data: createMany,
        });

        res.status(200).json({ message: "Attendance recorded successfully" });
      }
    } catch (error) {
      console.error("Error recording attendance:", error);
      res
        .status(500)
        .json({ message: "Error", error: "Internal Server Error" });
    }
  }
);

//get student attendence api
teacher.get("/:schoolId/:teacher_id/:className/:subject", async (req, res) => {
  try {
    const { schoolId, teacher_id, className, subject } = req.params;
    const findData = await prisma.attendence.findMany({
      where: {
        school_id: schoolId,
        teacher_id: teacher_id,
        class_name: className,
        subject: subject,
      },
      select: {
        subject: true,
        class_name: true,
        teacher_id: true,
        day: true,
      },
    });
  } catch (error) {}
});
//summary Report
//Attenendnce Reprot month
// teacher.get("/monthreport/:month/:school_id/:teacher_id/:class_id/:subject", async (req, res) => {
//   const { school_id, teacher_id, class_id, subject } = req.params;

//   try {
//     // Fetch attendance records based on provided primary keys
//     const attendance = await prisma.attendance.findMany({
//       where: {
//         school_id: parseInt(school_id),
//         teacher_id: parseInt(teacher_id),
//         class_id: parseInt(class_id),
//         subject: subject,
//       },
//       include: {
//         student: { select: { name: true } }, // Select student name
//       },
//     });

//     // Extract necessary fields and format the response
//     const presentCount = formattedAttendance.filter(record => record.is_present).length;
//     const formattedAttendance = attendance.map(record => ({
//       student_name: record.student.name,
//       date: record.date,
//       day: record.day,
//       is_present: record.is_present,
//     }));
   
//     // Send the formatted attendance data in the response
//     res.json(formattedAttendance,presentCount);
//   } catch (error) {
//     // Handle errors
//     console.error("Error fetching attendance:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
teacher.get("/monthreport/:date/:school_id/:teacher_id/:class_id/:subject", async (req, res) => {
  const { date, school_id, teacher_id, class_id, subject } = req.params;

  // Extract year and month from the provided date parameter
  const [year, month] = date.split("-");

  // Ensure month parameter is a valid number
  if (isNaN(parseInt(month))) {
    return res.status(400).json({ error: "Invalid month parameter" });
  }

  // Calculate start and end dates for the specified month
  const startDate = new Date(year, parseInt(month) - 1, 1).toISOString(); // Month is 0-indexed
  const endDate = new Date(year, parseInt(month), 0).toISOString(); // Last day of the specified month

  try {
    // Fetch attendance records within the specified month range
    const attendance = await prisma.attendance.findMany({
      where: {
        school_id: parseInt(school_id),
        teacher_id: parseInt(teacher_id),
        class_id: parseInt(class_id),
        subject: subject,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        student: { select: { name: true } }, // Select student name
      },
    });
    const presentCountByStudent = {};
    attendance.forEach(record => {
      const studentName = record.student.name;
      if (!presentCountByStudent[studentName]) {
        presentCountByStudent[studentName] = 0;
      }
      if (record.is_present === 'P') {
        presentCountByStudent[studentName]++;
      }
    });

    // Calculate the percentage of attendance for each student
    const totalDaysInMonth = 30; // Assuming 30 days in a month
    const attendancePercentageByStudent = Object.entries(presentCountByStudent).map(([name, presentCount]) => {
      const attendancePercentage = ((presentCount / totalDaysInMonth) * 100).toFixed(2); // Round to 2 decimal places
      return { name, percent: attendancePercentage };
    });

    // Send the formatted attendance data in the response
    res.json({ attendance: attendancePercentageByStudent });



















































































    
  } catch (error) {
    // Handle errors
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default teacher;
