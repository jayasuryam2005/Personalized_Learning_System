require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
async function start() {
  await connectDb();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
