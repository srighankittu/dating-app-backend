const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const app = express();
const PORT = 3000;
// This middleware converts JSON to js objects
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestsRouter);

connectDB()
  .then(() => {
    console.log("DB Connection Successful!");
    app.listen(PORT, () => {
      console.log("Successfully listening on PORT: ", PORT);
    });
  })
  .catch((err) => {
    console.log("Error establishing conection!");
  });
