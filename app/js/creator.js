/* ==================================================
   ZOHO CREATOR INTEGRATION

   Opens the Department Case Report form from the
   Zoho Creator Stage environment.

   Do not publish private environment URLs in the
   README or other public documentation.
================================================== */

const creatorFormButton = document.getElementById("creatorFormBtn");

/*
 * Replace the value below with the complete URL
 * copied from Department Case Report in Stage.
 */
const creatorFormUrl = "PASTE_THE_COMPLETE_STAGE_FORM_URL_HERE";

/* ==================================================
   REGISTER EVENT
================================================== */

if (creatorFormButton) {
  creatorFormButton.addEventListener("click", openCreatorCaseReport);
} else {
  console.error("The Creator Form button was not found.");
}

/* ==================================================
   OPEN CREATOR FORM
================================================== */

function openCreatorCaseReport() {
  if (
    !creatorFormUrl ||
    creatorFormUrl === "PASTE_THE_COMPLETE_STAGE_FORM_URL_HERE"
  ) {
    console.error("The Zoho Creator form URL has not been configured.");

    alert("The Department Case Report form has not been configured.");

    return;
  }

  const creatorWindow = window.open(
    creatorFormUrl,
    "_blank",
    "noopener,noreferrer",
  );

  if (!creatorWindow) {
    alert(
      "The browser blocked the Creator form. Please allow pop-ups for Zoho CRM.",
    );
  }
}
