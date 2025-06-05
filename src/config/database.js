const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://srighan_practice:oiiQGcWEg8ASqIsq@cluster0.yymynan.mongodb.net/datingApp"
  );
};

module.exports = { connectDB };
