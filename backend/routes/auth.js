import express from "express"
const router = express.Router();
import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import verifyToken from "../middleware/verifyToken.js";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
 
  


  if ( !name || !email || !password) {
    return res.json({
      success : false,
      message: "All fields required"
      })
  }
  
  if (!email.includes("@")) {
    return res.json({
      success: false,
      message: "Invalid email"
    });
  }

  if (password.length<8) {
    return res.json({
      success: false,
      message: "Password must be 8 characters"
    });
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.json(
      {
        success: false,
        message: "User already exist,try logIn"
      }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );



  res.json({
    success: true,
    message: "User registered successfully",
    token: token
  });







});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email)

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required"
    });
  }
  if (!email.includes("@")) {
    return res.json({
      success: false,
      message: "Invalid email"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ success: false, message: "Invalid password" });
  }
  
 
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)


  return res.json({
    success: true,
    message: "Login successful",
    token:token
  });

  // const token = jwt.sign({ id: user._id }, "mysecretkey");

})


router.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: "True",
    message: "Protected Profile",
    user: req.user
  })
})


export default router;
