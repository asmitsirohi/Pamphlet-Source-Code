const fetch = require("isomorphic-fetch");

const googleRecaptcha = (req, res, next) => {
  const { grecaptacha } = req.body;

  const secret_key = process.env.SECRET_KEY;
  const site_key = grecaptacha;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${site_key}`;

  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
      if (google_response.success == true) {
        next();
      } else {
        return res.json({ status: "error", error: "invalid_captcha" });
      }
    })
    .catch((error) => {
      return res.json({ error });
    });
};

module.exports = googleRecaptcha;
