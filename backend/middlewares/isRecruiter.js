// protect recruiter routes
import {User} from '../models/user.model.js'

const isRecruiter = async (req, res, next) => {
    const userId = req._id
    try {
        if (!userId) {
            return res.status(401).json({ message: "Sign in to access this route", success: false })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }
        if (user.role !== "recruiter") {
            return res.status(403).json({ message: "Forbidden: Only recruiters can access this route", success: false })
        }

        req.user = user // agar controller mein poora user object chahiye to yahan mil jayega
        next()
    } catch (error) {
        console.error("Error in isRecruiter middleware:", error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export default isRecruiter