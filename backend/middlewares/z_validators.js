
import { z } from 'zod'

const mongoId = z
    .string({ required_error: 'ID is required' })
    .regex(/^[a-f\d]{24}$/i, 'Invalid ID format')

const emailField = z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase()

const passwordField = z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')

const phoneField = z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[0-9\s\-()]+$/, 'Phone number can only contain digits, spaces, dashes, parentheses, and an optional leading +')
const roleField = z.enum(['student', 'recruiter'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be either student or recruiter',
})


 
export const registerSchema = z.object({
    fullName: z
        .string({ required_error: 'Full name is required' })
        .trim()
        .min(3, 'Full name must be at least 3 characters')
        .max(50, 'Full name cannot exceed 50 characters'),
    email: emailField,
    password: passwordField,
    phoneNumber: phoneField,
    role: roleField,
})

export const loginSchema = z.object({
    email: emailField,
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
    role: roleField,
})

 
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters long')
    .max(50, 'Full name cannot exceed 50 characters'),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),

  phoneNumber: z
    .string()
    .trim()
    .min(7, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(/^[+]?[0-9\s-]+$/, 'Phone number can only contain digits, spaces, + and -'),

  bio: z
    .string()
    .trim()
    .max(50, 'Bio cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),

  skills: z
    .string()
    .trim()
    .max(500, 'Skills list cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});


 
export const createJobSchema = z.object({
    title: z
        .string({ required_error: 'Job title is required' })
        .trim()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(100, 'Title cannot exceed 100 characters'),
    description: z
        .string({ required_error: 'Description is required' })
        .trim()
        .min(20, { message: 'Description must be at least 20 characters' }),
    requirements: z
        .string({ required_error: 'Requirements are required' })
        .trim()
        .min(1, { message: 'Requirements cannot be empty' }),
    // z.preprocess — frontend se string ata hai, Number() se convert karo pehle
    salary: z.preprocess(
        (val) => Number(val),
        z.number({ required_error: 'Salary is required' }).nonnegative({ message: 'Salary cannot be negative' })
    ),
    experience: z.string({ required_error: 'Experience is required' }).trim().min(1),
    location: z.string({ required_error: 'Location is required' }).trim().min(1),
    vacancies: z.preprocess(
        (val) => Number(val),
        z.number({ required_error: 'Vacancies is required' }).int().min(1, { message: 'At least 1 vacancy required' })
    ),
    companyId: mongoId,
})

// update me sab optional + kam se kam ek field chahiye
export const updateJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(100, { message: 'Title cannot exceed 100 characters' })
         ,

    description: z
        .string()
        .trim()
        .min(20, { message: 'Description must be at least 20 characters' })
       ,
// apply regeex as it should be comma separated values, and each requirement should be at least 2 characters
   requirements: z.string()
    .trim()
    .min(10, { message: 'Requirements must be at least 10 characters' })
    .regex(/^(\s*[a-zA-Z0-9\s]{2,}\s*)(,\s*[a-zA-Z0-9\s]{2,}\s*)*$/, 'Requirements must be comma-separated values, each at least 2 characters')
    ,

    // empty string "" → undefined (Zod ignore karega)
    // valid number string "50000" → 50000
    salary: z.preprocess(
        (val) => (val === '' || val === null) ? undefined : Number(val),
        z.number().nonnegative({ message: 'Salary cannot be negative' }).optional()
    ),

    experience: z.string().trim().min(1).optional(),
    location: z.string().trim().min(1).optional(),

    vacancies: z.preprocess(
        (val) => (val === '' || val === null) ? undefined : Number(val),
        z.number().int().min(1, { message: 'At least 1 vacancy required' }).optional()
    ),

    // companyId form se aata hai — strip na ho isliye schema mein rakho
    // lekin validate mat karo (recruiter change nahi kar sakta)
    companyId: z.string().optional(),
})


// ─────────────────────────────────────────────────────────────────────────────
// COMPANY schemas
// ─────────────────────────────────────────────────────────────────────────────

export const registerCompanySchema = z.object({
    companyName: z
        .string({ required_error: 'Company name is required' })
        .trim()
        .min(3, 'Company name must be at least 3 characters')
        .max(100, 'Company name cannot exceed 100 characters'),
})

export const updateCompanySchema = z.object({
    companyName: z.string().trim().min(3, 'Company name must be at least 3 characters').max(100, 'Company name cannot exceed 100 characters'),
    description: z.string().trim().min(20, 'Description must be at least 20 characters').max(1000, 'Description cannot exceed 1000 characters'),
    website: z.string().trim().url('Enter a valid URL').or(z.literal('')),
    location: z.string().trim().min(10, 'Location must be at least 10 characters').max(100, 'Location cannot exceed 100 characters'),
})


// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION schemas
// ─────────────────────────────────────────────────────────────────────────────

export const updateStatusSchema = z.object({
    status: z.enum(['pending', 'accepted', 'rejected'], {
        required_error: 'Status is required',
        invalid_type_error: 'Status must be pending, accepted, or rejected',
    }),
})


// ─────────────────────────────────────────────────────────────────────────────
// URL PARAMS schema — har /:_id route pe lagao
// ─────────────────────────────────────────────────────────────────────────────

export const mongoIdParamSchema = z.object({
    _id: mongoId,
})