import  Joi from 'joi';

const SuperAdminCreate=Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email:Joi.string().email().required(),
  phone: Joi.number().integer().min(0).max(9999999999).required()
  .messages({
    'number.base': 'Phone number must be a number',
    'number.integer': 'Phone number must be an integer',
    'number.min': 'Phone number must be a positive number',
    'number.max': 'Phone number should not exceed 10 digits',
    'any.required': 'Phone number is required'
  }),
  username:Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(5).required(),
});
const SuperAdminSchemaLogin = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
});
const adminLoginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
});

const addadminSchema=Joi.object({
  schoolName:Joi.string().alphanum().min(3).max(30).required(),
  schoolAddress: Joi.string().required(),
  email:Joi.string().email().required(),
  phone: Joi.number().integer().min(0).max(9999999999).required()
  .messages({
    'number.base': 'Phone number must be a number',
    'number.integer': 'Phone number must be an integer',
    'number.min': 'Phone number must be a positive number',
    'number.max': 'Phone number should not exceed 10 digits',
    'any.required': 'Phone number is required'
  }),

  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),

});
const teacherSchema=Joi.object({
  name:Joi.string().min(3).max(30).required(),
 address:Joi.string().min(3).max(30).required(),
  phone: Joi.number().integer().min(0).max(9999999999).required()
  .messages({
    'number.base': 'Phone number must be a number',
    'number.integer': 'Phone number must be an integer',
    'number.min': 'Phone number must be a positive number',
    'number.max': 'Phone number should not exceed 10 digits',
    'any.required': 'Phone number is required'
  }),
  email:Joi.string().email().required(),
  course:Joi.string().alphanum().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  
});
const StudentSchema=Joi.object({
  
  name:Joi.string().min(3).max(30).required(),
  class_id:Joi.required(),
  address:Joi.string().min(3).max(30).required(),
  section_id:Joi.required(),
  phone:  Joi.string().allow('', null).regex(/^\d{10}$/)
  .messages({
    'string.pattern.base': 'Phone number must be a 10-digit number',
    'any.required': 'Phone number is required'
  }),
  father_name:Joi.string().min(3).max(30).required(),
  father_phone:   Joi.string().regex(/^\d{10}$/).required()
  .messages({
    'string.pattern.base': 'Phone number must be a 10-digit number',
    'any.required': 'Phone number is required'
  }),
});
//admin search student
const AdminsearchStudent=Joi.object({
  name:Joi.string().min(3).max(30).required(),
  class_name:Joi.string().min(3).max(30).required(),
});

const CreateClass=Joi.object({
  school_id:Joi.number().required(),
  class_name:Joi.string().min(3).max(30).required(),
});
const CourseSchema=Joi.object({
  
  course_name:Joi.string().min(3).max(30).required(),
});

const SubjectSchema=Joi.object({
 
  subject_name:Joi.string().max(20).min(3).required(),
  level:Joi.string(),
   
});
const AttendenceSchema=Joi.object({
  class_name:Joi.string().required(),
  subject_name:Joi.string().max(20).min(3).required(),
  teacher_id:Joi.number().required(),
  student_id:Joi.number().required(),
  present:Joi.boolean().required()
});
 
export {
  SuperAdminCreate,
  SuperAdminSchemaLogin,
  adminLoginSchema,
  addadminSchema,
  teacherSchema,
  StudentSchema,
  AdminsearchStudent,
  CreateClass,
  CourseSchema,
  SubjectSchema,
  AttendenceSchema
};
