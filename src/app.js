const express = require("express");
const app = express();
const PORT = 3000;

// app.use("/", (req, res) => {
//   res.send("Hello from default Server!");
// });

app.use("/test", (req, res) => {
  res.send("Hello from test route");
});

app.use("/hello", (req, res) => {
  res.send("Hello from hello route!");
});

app.listen(PORT, () => {
  console.log("Successfully listening on PORT: ", PORT);
});
