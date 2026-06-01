/* =========================================================================
   Melange India — Lead capture
   ========================================================================= */

const SHEET_ENDPOINT = "https://script.google.com/macros/library/d/1r5XNPhSYs7r6qTIfm4Sal8cIvLBQTQqgORaswxWFh_CRo0Vr-Bz2Whjn/6";

/* ---------- Source Detection ---------- */

function detectSource() {

  const params = new URLSearchParams(location.search);

  const known = [
    "website",
    "instagram",
    "linkedin",
    "facebook",
    "whatsapp",
    "google",
    "email"
  ];

  let src = (
    params.get("source") ||
    params.get("utm_source") ||
    ""
  ).toLowerCase().trim();

  if (known.includes(src)) return src;

  const ref = document.referrer.toLowerCase();

  if (ref.includes("instagram")) return "instagram";
  if (ref.includes("linkedin")) return "linkedin";
  if (ref.includes("facebook") || ref.includes("fb.")) return "facebook";
  if (ref.includes("whatsapp") || ref.includes("wa.me")) return "whatsapp";
  if (ref.includes("google")) return "google";

  return "website";
}

const source = detectSource();

const pretty = {
  website: "Website",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  google: "Google",
  email: "Email"
};

/* ---------- Hidden Fields ---------- */

document.getElementById("sourceField").value = source;
document.getElementById("sourceLabel").textContent =
  pretty[source] || "Website";

document.getElementById("pageUrlField").value = location.href;

/* ---------- Form ---------- */

const form = document.getElementById("leadForm");
const msg = document.getElementById("formMsg");
const btn = document.getElementById("submitBtn");

/* ---------- Message ---------- */

function show(type, text) {

  msg.className = "form-msg " + type;
  msg.textContent = text;

  msg.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* ---------- Submit ---------- */

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  // Honeypot
  if (form._gotcha.value) return;

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  delete data._gotcha;

  data.timestamp = new Date().toISOString();

  btn.disabled = true;

  const original = btn.textContent;

  btn.textContent = "Sending...";

  try {

    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    // Google Analytics Event
    if (typeof gtag === "function") {

      gtag("event", "generate_lead", {
        lead_source: source,
        interest: data.interest || ""
      });

    }

    form.reset();

    document.getElementById("sourceField").value = source;

    show(
      "ok",
      "✓ Thank you! Your enquiry has been received. Our team will get back to you within 48 working hours."
    );

  } catch (err) {

    console.error(err);

    show(
      "err",
      "Something went wrong. Please try again."
    );

  } finally {

    btn.disabled = false;

    btn.textContent = original;

  }

});
