const form = document.getElementById("userEmailForm");
const nonSpinnerBtn = document.getElementById("nonSpinnerBtn");
const spinnerBtn = document.getElementById("spinnerBtn");

form.onsubmit = (e) => {
  e.preventDefault();

  nonSpinnerBtn.style.display = "none";
  spinnerBtn.style.display = "block";

  const username = document.getElementById("username").value;
  const email = document.getElementById("useremail").value;
  const hostemail = document.getElementById("hostemail").value;
  const hostname = document.getElementById("hostname").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  fetch("/contactUs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      hostemail,
      hostname,
      subject,
      message,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      spinnerBtn.style.display = "none";
      nonSpinnerBtn.style.display = "block";
      if (res.status == "ok") {
        alert("Mail Sent Successfully");
      } else {
        alert("Something Went Wrong. Please, Try after sometime");
      }
    });
};
