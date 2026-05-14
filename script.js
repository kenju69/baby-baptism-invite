document.addEventListener("DOMContentLoaded", () => {

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz45G-JRgfPYE_T9O0XbWupi3JprtPXtO5MuYrBpPmi5_qfcoGtuvnywd9NO-f25jRxEA/exec";

  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const form = document.getElementById('rsvpForm');

  const attendingFields = document.getElementById('attendingFields');
  const notAttendingMsg = document.getElementById('notAttendingMsg');

  let status = "";
  let submitted = false;
  let isSubmitting = false;
  let finalStatus = null;

  // INIT STATE
  form.style.display = "none";
  attendingFields.style.display = "none";
  notAttendingMsg.style.display = "none";

  const submitBtn = form.querySelector(".submit-btn");

  // ======================
  // RESET UI FUNCTION
  // ======================
  function resetView() {
    attendingFields.style.display = "none";
    notAttendingMsg.style.display = "none";
    submitBtn.style.display = "block";
  }

  // ======================
  // ATTENDING
  // ======================
  yesBtn.addEventListener('click', () => {

    if (submitted || isSubmitting || finalStatus) return;

    status = "YES";

    form.style.display = "flex";

    attendingFields.style.display = "flex";
    notAttendingMsg.style.display = "none";

    submitBtn.style.display = "block";

    yesBtn.classList.add('active-btn');
    noBtn.classList.remove('active-btn');

  });

  // ======================
  // NOT ATTENDING
  // ======================
  noBtn.addEventListener('click', () => {

    if (submitted || isSubmitting || finalStatus) return;

    status = "NO";

    form.style.display = "flex";

    attendingFields.style.display = "none";
    notAttendingMsg.style.display = "block";

    // ❗ IMPORTANT: hide submit button
    submitBtn.style.display = "none";

    noBtn.classList.add('active-btn');
    yesBtn.classList.remove('active-btn');

  });

  // ======================
  // SUBMIT
  // ======================
  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    if (isSubmitting || finalStatus) return;

    isSubmitting = true;

    // LOCK EVERYTHING (fix #1)
    yesBtn.disabled = true;
    noBtn.disabled = true;
    yesBtn.style.pointerEvents = "none";
    noBtn.style.pointerEvents = "none";

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;

    const formData = new URLSearchParams();

    formData.append("status", status);
    formData.append("name", document.getElementById('name')?.value || "");
    formData.append("adults", document.getElementById('adults')?.value || "");
    formData.append("kids", document.getElementById('kids')?.value || "");

    try {

      await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      finalStatus = status;

      // ======================
      // SUCCESS UI (FIX #4)
      // ======================
      form.innerHTML = `
        <div class="thank-you">
          <h3>YES! Thank you 💛</h3>
          <p>Your RSVP has been recorded successfully.</p>
        </div>
      `;

      // remove buttons completely
      yesBtn.style.display = "none";
      noBtn.style.display = "none";

    } catch (err) {

      console.error(err);
      alert("Network error. Please try again.");

      isSubmitting = false;

      yesBtn.disabled = false;
      noBtn.disabled = false;
      yesBtn.style.pointerEvents = "auto";
      noBtn.style.pointerEvents = "auto";

      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit RSVP";
    }

  });

});