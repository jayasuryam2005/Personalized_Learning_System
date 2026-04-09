const User = require("../models/User");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@skillpath.com";
  const name = process.env.ADMIN_NAME || "Admin";
  const password = process.env.ADMIN_PASSWORD || "admin@123";

  const existing = await User.findOne({ role: "admin", email });
  if (existing) {
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: "admin",
    avatar: name.charAt(0).toUpperCase(),
  });
}

module.exports = seedAdmin;
