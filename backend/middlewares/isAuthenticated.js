import jwt from 'jsonwebtoken'
// MiddleWare
const isAuthenticated = async (req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                message:"User Is Not Authenticated!",
                success:false,
            })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token!",
                success:false,
            })
        }
        req._id = decode.userId // it will be used in the controller by using req._id
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something Went Wrong!",
            success:false,
        })
    }
}

export default isAuthenticated ;