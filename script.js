const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz45G-JRgfPYE_T9O0XbWupi3JprtPXtO5MuYrBpPmi5_qfcoGtuvnywd9NO-f25jRxEA/exec";

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const form = document.getElementById('rsvpForm');
const declineText = document.getElementById('declineText');

let status = "YES";
let submitted = false;
let isSubmitting = false;
let finalStatus = null;

// YES
yesBtn.addEventListener('click', () => {
  if (submitted) return;

  status = "YES";

  form.style.display = "flex";
  declineText.style.display = "none";

  yesBtn.classList.add('active-btn');
  noBtn.classList.remove('active-btn');
});

// NO
noBtn.addEventListener('click', () => {
  if (submitted) return;

  status = "NO";

  form.style.display = "none";
  declineText.style.display = "block";

  noBtn.classList.add('active-btn');
  yesBtn.classList.remove('active-btn');
});

// SUBMIT
form.addEventListener('submit', async (e) => {

  e.preventDefault();

  if (isSubmitting || finalStatus) return;

  isSubmitting = true;

  // disable buttons immediately
  yesBtn.disabled = true;
  noBtn.disabled = true;

  yesBtn.style.opacity = "0.6";
  noBtn.style.opacity = "0.6";

  // show loading on button
  const submitBtn = form.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = "Sending...";
  submitBtn.style.cursor = "not-allowed";
  submitBtn.style.opacity = "0.7";

  const formData = new URLSearchParams();

  formData.append("name", document.getElementById('name').value);
  formData.append("adults", document.getElementById('adults').value);
  formData.append("kids", document.getElementById('kids').value);
  formData.append("status", status);

  try {

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData
    });

    finalStatus = status;

    // restore button text (just in case)
    submitBtn.innerHTML = originalText;

    if (status === "YES") {

      form.style.transition = "all 0.4s ease";
      form.style.opacity = "0";
      form.style.transform = "translateY(10px)";

      setTimeout(() => {
        form.innerHTML = `
          <div class="thank-you">
            <h3>Thank you 💛</h3>
            <p>Your RSVP has been received.</p>
          </div>
        `;

        form.style.opacity = "1";
        form.style.transform = "translateY(0)";
      }, 300);

      yesBtn.classList.add('active-btn');
      noBtn.classList.remove('active-btn');

    } else {

      declineText.innerText = "Thank you for letting us know.";
      declineText.style.display = "block";

      noBtn.classList.add('active-btn');
      yesBtn.classList.remove('active-btn');
    }

  } catch (err) {

    console.error(err);

    alert("Network error. Please try again.");

    // restore everything if failed
    isSubmitting = false;

    yesBtn.disabled = false;
    noBtn.disabled = false;

    yesBtn.style.opacity = "1";
    noBtn.style.opacity = "1";

    submitBtn.innerHTML = originalText;
    submitBtn.style.cursor = "pointer";
    submitBtn.style.opacity = "1";
  }

});