const util = require("util");
const gc = require("../utils/cloudStorage");
const bucket = gc.bucket("pamphlet-8e582.appspot.com");

module.exports = {
  uploadImage: function (file) {
    return new Promise((resolve, reject) => {
      let { originalname, buffer } = file;
      originalname = Date.now() + originalname;

      const blob = bucket.file(originalname.replace(/ /g, "_"));
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream
        .on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        })
        .on("error", () => {
          reject(`Unable to upload image, something went wrong`);
        })
        .end(buffer);
    });
  },
};
