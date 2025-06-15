const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const requestsRouter = require("./routes/requests");
const { User } = require("./models/user");
const cors = require("cors");
const app = express();
const PORT = 3000;
const CORS_OPTIONS = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};
// This middleware converts JSON to js objects
app.use(express.json());
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

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
