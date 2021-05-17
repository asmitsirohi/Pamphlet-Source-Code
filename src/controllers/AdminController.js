const User = require("../models/UserModel");
const Template = require("../models/TemplateModel");
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../middlewares/fileUpload");

// MULTER SPECIFIC STUFF
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2097152 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("templateImage");

function checkFileType(file, cb) {
  // Allowed extension
  const fileTypes = /jpeg|jpg|png/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("invalid_image");
  }
}
//-------------------------------------------------------------------------------------------//

class AdminController {
  dashboard = (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }

    const params = { title: "Admin-Portfolio Template", loggedinUser, role };
    res.status(200).render("admin/dashboard", params);
  };

  assignRolePage = async (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }

    try {
      const users = await User.find().lean();

      const params = { title: "Assign Roles", loggedinUser, role, users };
      res.status(201).render("admin/assignRole", params);
    } catch (error) {
      const params = {
        title: "404 Not found",
        errorMsg: `Server error: ${error.name}`,
      };
      res.status(500).render("error/404", params);
    }
  };

  assignRole = async (req, res) => {
    try {
      const { userId, roleName } = req.body;

      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { role: roleName }
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error", error: "wrong" });
    }
  };

  addTemplatePage = (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }

    const params = { title: "Add Templates", loggedinUser, role };
    res.status(200).render("admin/addTemplate", params);
  };

  addTemplate = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.json({ status: "error", error: "file_size_exceed" });
        }
        res.json({ status: "error", error: err });
      } else {
        if (req.file == undefined) {
          res.json({ status: "error", error: "No File Selected!" });
        } else {
          const myFile = req.file;

          uploadImage(myFile)
            .then(async (image) => {
              const { name, foldername, description } = req.body;

              try {
                const template = await Template.findOne({ foldername });
                if (template != null) {
                  return res.json({ status: "error", error: "already_exists" });
                }
                const newTemplate = new Template({
                  name,
                  foldername,
                  description,
                  image,
                });
                const savedTemplate = await newTemplate.save();
                res.json({ status: "ok" });
              } catch (error) {
                res.status(500).json({ status: "error", error: "wrong" });
              }
            })
            .catch((error) => {
              return res.status(500).json({ status: "error", error: "wrong" });
            });
        }
      }
    });
  };
}

module.exports = AdminController;
