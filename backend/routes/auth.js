const express = require("express")
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');



const JWT_SECRET = 'Thinkerisagooddb$$oyyy';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No Login Required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
let success = false;
  // If ther are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  // Check whether the user with this email exists already
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      success= false;
      return res.status(400).json({success, error: "Sorry a user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })
    // res.json(user)

  }
  catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Login the user: POST "/api/auth/login". No login Required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password Cannot be blank').exists(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success= false;
      return res.status(400).json({success, error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Get loggedin User Details using: POST "/api/auth/getuser". Login required.
router.post('/getuser',fetchuser, async (req, res) => {
try {
  userId = req.user.id
  const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");  
}
})

module.exports = router