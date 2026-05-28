/* =========================================================================
   Melange India — Lead capture
   - Auto-detects the lead SOURCE (website / instagram / linkedin / facebook…)
   - Submits the lead to a Google Sheet via a Google Apps Script Web App
   ========================================================================= */

/* 1) PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW (see google-apps-script.gs) */
const SHEET_ENDPOINT = "https://script.google.com/a/macros/melangeindia.in/s/AKfycbwh2dy1XIDFMRMvN9KfzyM9FDdNZNPxNTeldTsBWf4Frb30xKD_Oud7AD1TUV2qFdWo/exec";

/* ---------- Source auto-detection ----------
   Priority:
   1. ?source=  URL parameter  (e.g. ?source=instagram)  ← link this from your bio
   2. utm_source URL parameter (e.g. ?utm_source=linkedin)
   3. HTTP referrer (if user clicked through from instagram.com / linkedin.com…)
   4. Fallback: "website"
*/
function detectSource() {
  const params = new URLSearchParams(location.search);
  const known = ["website", "instagram", "linkedin", "facebook", "whatsapp", "google", "email"];

  let src = (params.get("source") || params.get("utm_source") || "").toLowerCase().trim();
  if (known.includes(src)) return src;

  const ref = document.referrer.toLowerCase();
  if (ref.includes("instagram")) return "instagram";
  if (ref.includes("linkedin"))  return "linkedin";
  if (ref.includes("facebook") || ref.includes("fb.")) return "facebook";
  if (ref.includes("whatsapp") || ref.includes("wa.me")) return "whatsapp";
  if (ref.includes("google"))    return "google";

  return "website";
}

const source = detectSource();
const pretty = { website:"Website", instagram:"Instagram", linkedin:"LinkedIn",
                 facebook:"Facebook", whatsapp:"WhatsApp", google:"Google", email:"Email" };

document.getElementById("sourceField").value = source;
document.getElementById("sourceLabel").textContent = pretty[source] || "Website";
document.getElementById("pageUrlField").value = location.href;

/* ---------- Form submission ---------- */
const form = document.getElementById("leadForm");
const msg = document.getElementById("formMsg");
const btn = document.getElementById("submitBtn");

function show(type, text) {
  msg.className = "form-msg " + type;
  msg.textContent = text;
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // honeypot — silently drop bots
  if (form._gotcha.value) return;

  const data = Object.fromEntries(new FormData(form).entries());
  delete data._gotcha;
  data.timestamp = new Date().toISOString();

  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "Sending…";

  if (SHEET_ENDPOINT.startsWith("PASTE_")) {
    show("err", "⚙️ Form not yet connected. Add your Google Apps Script URL in contact.js (SHEET_ENDPOINT).");
    btn.disabled = false; btn.textContent = original;
    return;
  }

  try {
    // text/plain avoids a CORS preflight against Apps Script
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });
    // no-cors gives an opaque response, so we optimistically confirm
    // Track the conversion in Google Analytics (if GA4 is loaded)
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", { lead_source: source, interest: data.interest || "" });
    }
    form.reset();
    document.getElementById("sourceField").value = source;
    show("ok", "✓ Thank you! Your enquiry has been received. Our team will get back to you within 48 working hours.");
  } catch (err) {
    show("err", "Something went wrong. Please email us directly at info@melangeindia.in or call +91-80-2297 5431.");
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
});
