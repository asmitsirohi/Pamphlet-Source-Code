const Cloud = require("@google-cloud/storage");
const path = require("path");
const serviceKey = path.join(__dirname, './keys.json');

// pamphlet-8e582-a759fcce1b39

const { Storage } = Cloud;

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "pamphlet-8e582",
});

module.exports = storage;
