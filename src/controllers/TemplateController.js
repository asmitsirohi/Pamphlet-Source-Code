const Template = require("../models/TemplateModel");
const User = require("../models/UserModel");
const UserTemplate = require("../models/UserTemplateModel");
const path = require("path");
const sendmail = require("../middlewares/sendMail");
const { error } = require("console");
const { nextTick } = require("process");

class TemplateController {
  portfolio = async (req, res) => {
    const username = req.params.username;
    const foldername = req.params.foldername;

    try {
      const userId = await User.findOne({ username }, { _id: 1 }).lean();
      const templateId = await Template.findOne(
        { foldername },
        { _id: 1 }
      ).lean();

      if (userId == null || templateId == null) {
        throw error;
      }

      const usertemplate = await UserTemplate.find({
        $and: [{ user: userId }, { template: templateId }],
      }).lean();

      const params = {
        layout: "templateLayout",
        title: `Portfolio-${username}`,
        usertemplate,
      };
      res.status(200).render(`templates/${foldername}/`, params);
    } catch (error) {
      const params = {
        title: "404 Not found",
        errorMsg: `Error: ${error.name}`,
      };
      res.status(404).render("error/404", params);
    }
  };

  contactUs = (req, res) => {
    const {username, email, hostemail ,hostname ,subject, message} = req.body;

    const newMessage = `<h3>Hi, ${hostname}</h3> <p>Someone with name <b>${username}</b> and email ${email} wants to contact you.</p> <br><br> ${message} <br><br><br> <small>It is a computer generated mail. Please Do not reply on this.</small>`;
    
    sendmail(hostemail, subject, newMessage, (err)=>{

      if(err) {
        return  res.status(500).json({ status: "error", error: "wrong" });
      } 

      res.status(200).json({ status: "ok" });

    });
  }
}

module.exports = TemplateController;
