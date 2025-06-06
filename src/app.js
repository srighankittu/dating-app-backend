const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const app = express();
const PORT = 3002;
// This middleware converts JSON to js objects
app.use(express.json());

// signup API
app.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.send(err);
  }
});

// find single user by email
app.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({
      email,
    });
    if (user.length != 0) {
      res.send(user);
    } else {
      res.status(404).send("USer not found bitch");
    }
  } catch (err) {
    res.status(400).send("Some Issue IDC about");
  }
});

//delete user
app.delete("/user", async (req, res) => {
  try {
    const userID = req.body.userID;
    await User.findByIdAndDelete(userID);
    res.send("User Deleted Successfuly");
  } catch (err) {
    res.status(500).send("User was not deleted");
  }
});

//feed API to get all users in the DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("unable to fetch Users for your feed");
  }
});

//update user data
app.patch("/user/:userID", async (req, res) => {
  try {
    // const id = req.body.userID; Can be ferched from the params and not from body
    const id = req.params.userID;
    const data = req.body;
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((item) => {
      return ALLOWED_UPDATES.includes(item);
    });
    if (!isUpdateAllowed) throw new Error("You cannot update these detail(s)");
    if (data.skills.length > 10)
      throw new Error("You cannot add more than 10 skills dude, wtf?");
    await User.findOneAndUpdate({ _id: id }, data, {
      returnDocument: "before", // Will return document before update, "after" will return new document after update
      runValidators: true, // will do the validation checks even on patch calls. By default they apply only on new documents
    });
    res.send("Data Updated Successfully!");
  } catch (err) {
    res.status(500).send("User Data Cannot be updated" + err);
  }
});

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
