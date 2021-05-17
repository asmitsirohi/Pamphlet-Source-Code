const Template = require("../models/TemplateModel");
const UserTemplate = require("../models/UserTemplateModel");
const path = require("path");
const multer = require("multer");
const { uploadImage } = require("../middlewares/fileUpload");

// MULTER SPECIFIC STUFF
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2097152 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

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

class DashboardController {
  index = (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }

    const params = { title: "Pamphlet", loggedinUser, role };
    res.status(200).render("index", params);
  };

  templates = async (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }

    try {
      let templates = await Template.find().lean();

      if (req.user != undefined) {
        const templatesCheck = await Template.find(null, { _id: 1 }).lean();
        let templatesCheckArray = [];
        templatesCheck.forEach((element) => {
          templatesCheckArray.push(element._id);
        });

        const usertemplates = await UserTemplate.find(
          { user: req.user._id },
          { template: 1, _id: 0 }
        ).lean();
        let usertemplateArray = [];
        usertemplates.forEach((element) => {
          usertemplateArray.push(JSON.stringify(element.template));
        });

        let finalArray = templatesCheckArray.filter(filter_obj);

        function filter_obj(obj) {
          obj = JSON.stringify(obj);
          return usertemplateArray.indexOf(obj) === -1;
        }

        templates = await Template.find({ _id: { $in: finalArray } }).lean();
      }

      const params = { title: "Templates", loggedinUser, templates, role };
      res.status(200).render("templates", params);
    } catch (error) {
      const params = {
        title: "500 Error",
        errorMsg: `Server error: ${error.name}`,
      };
      res.status(500).render("error/500", params);
    }
  };

  viewTemplates = async (req, res) => {
    try {
      const _id = req.params.id;

      const template = await Template.findOne({ _id });

      res
        .status(200)
        .sendFile(
          path.join(
            __dirname,
            `../../templates/${template.foldername}`,
            "index.html"
          )
        );
    } catch (error) {
      const params = {
        title: "404 Not found",
        errorMsg: `Server error: ${error.name}`,
      };
      res.status(500).render("error/404", params);
    }
  };

  useTemplatePage = (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }
    const id = req.params.id;
    const params = { title: "Use Template", loggedinUser, id, role };
    res.status(200).render("useTemplate", params);
  };

  useTemplate = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
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
              const {
                name,
                Introtagline,
                templateId,
                about,
                projects,
                links,
                email,
              } = req.body;

              let skills = req.body.skills;
              skills = skills.split(",");

              let key_points = req.body.key_points;
              key_points = key_points.split(",");
              try {
                const newUserTemplate = new UserTemplate({
                  user: req.user._id,
                  template: templateId,
                  name,
                  Introtagline,
                  profileImage: image,
                  about,
                  skills,
                  key_points,
                  email,
                  links: JSON.parse(links),
                  projects: JSON.parse(projects),
                });
                const savedTemplate = await newUserTemplate.save();
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

module.exports = DashboardController;
