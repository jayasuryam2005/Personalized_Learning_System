const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400);
    throw new Error("Email, password, and role are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase(), role });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  res.json({
    token: signToken(user),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      subject: user.subject,
      teacher: user.teacher,
      batch: user.batch,
    },
  });
});

module.exports = { login };
