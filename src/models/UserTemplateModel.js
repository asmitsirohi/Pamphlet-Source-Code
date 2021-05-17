const mongoose = require("mongoose");

const userTemplateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "template",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  key_points: {
    type: Array,
  },
  Introtagline: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  about: {
    type: String,
  },
  skills: {
    type: Array,
  },
  links: [
    {
      twitter: String,
      github: String,
      linkedin: String,
      facebook: String,
      instagram: String,
    },
  ],
  projects: [
    {
      projectName: String,
      projectDescription: String,
      projectLink: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserTemplate = new mongoose.model("usertemplate", userTemplateSchema);

module.exports = UserTemplate;
