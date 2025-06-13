const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const requestsRouter = require("./routes/requests");
const { User } = require("./models/user");
const app = express();
const PORT = 3000;
// This middleware converts JSON to js objects
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/request", requestsRouter);

connectDB()
  .then(() => {
    console.log("DB Connection Successful!");
    app.listen(PORT, () => {
      console.log("Successfully listening on PORT: ", PORT);
    });
  })
  .then(async () => {
    await User.init();
  })
  .catch((err) => {
    console.log("Error establishing conection!");
  });
