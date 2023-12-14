const form = document.querySelector("#contact-form");
const submitButton = document.querySelector("#submit-btn");

const scriptURL =
  "https://script.google.com/macros/s/AKfycbwbkSrebQEIBSvQ7v_VmpGYtggFRWTm0AvZ9yXLsMsU64UMy1wgrOexKjDlmtJJyN-2Xw/exec";

form.addEventListener("submit", (e) => {
  submitButton.disabled = true;
  submitButton.innerHTML = "Sending...";
  e.preventDefault();

  let requestBody = new FormData(form);
  fetch(scriptURL, { method: "POST", body: requestBody })
    .then(() => {
      alert("Thank you. I'll get in touch soon!");
      submitButton.disabled = false;
      submitButton.innerHTML = "Send Message";
      form.reset();
    })
    .catch(() => {
      alert("Something went wrong");
      submitButton.disabled = false;
      submitButton.innerHTML = "Send Message";
      form.reset();
    });
});
