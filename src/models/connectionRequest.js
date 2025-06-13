const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Here we are creating reference to User Collection
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `Incorrect status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function () {
  const request = this;
  if (request.fromUserID.equals(this.toUserID)) {
    throw new Error("You cannot send request to yourself!");
  }
});

connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 });

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = {
  ConnectionRequest,
};
