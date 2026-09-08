/* ==================================================
   RECENT DEALS

   This file handles only the Recent Deals section.
   The stable Zoho CRM logic remains inside app.js.
================================================== */

const loadDealsButton = document.getElementById("loadDealsBtn");

const dealResultsContainer = document.getElementById("deal-list");

/* ==================================================
   REGISTER EVENT
================================================== */

if (loadDealsButton) {
  loadDealsButton.addEventListener("click", loadRecentDeals);
} else {
  console.error("The Load Deals button was not found.");
}

/* ==================================================
   LOAD DEALS
================================================== */

function loadRecentDeals() {
  if (!dealResultsContainer || !loadDealsButton) {
    console.error("The Deals section could not be initialized.");
    return;
  }

  if (!window.ZOHO || !ZOHO.CRM || !ZOHO.CRM.API) {
    setRecordStatus(
      dealResultsContainer,
      "The Zoho CRM API is not available.",
      "error",
    );
    return;
  }

  setButtonLoading(loadDealsButton, true, "Loading Deals...");

  setRecordStatus(dealResultsContainer, "Loading deals...", "loading");

  ZOHO.CRM.API.getAllRecords({
    Entity: "Deals",
    page: 1,
    per_page: 10,
  })
    .then(function (response) {
      console.log("Deals response:", response);

      const deals =
        response && Array.isArray(response.data) ? response.data : [];

      dealResultsContainer.replaceChildren();

      if (deals.length === 0) {
        setRecordStatus(dealResultsContainer, "No deals found.", "empty");
        return;
      }

      deals.slice(0, 10).forEach(function (deal) {
        const dealCard = createDealCard(deal);

        dealResultsContainer.appendChild(dealCard);
      });

      const loadedCount = Math.min(deals.length, 10);

      announceRecordResult(
        dealResultsContainer,
        `${loadedCount} deal${loadedCount === 1 ? "" : "s"} loaded.`,
      );
    })
    .catch(function (error) {
      console.error("Error loading deals:", error);

      setRecordStatus(
        dealResultsContainer,
        "Unable to load deals. Please try again.",
        "error",
      );
    })
    .finally(function () {
      setButtonLoading(loadDealsButton, false, "Load Deals");
    });
}

/* ==================================================
   CREATE DEAL CARD
================================================== */

function createDealCard(deal) {
  const card = document.createElement("div");

  /*
   * We reuse the existing card class so this new
   * section matches Leads and Accounts visually.
   */
  card.className = "lead-card";

  const dealName = deal.Deal_Name || "Unnamed Deal";

  const stage = deal.Stage || "No stage";

  const amount = formatDealAmount(deal.Amount);

  const closingDate = deal.Closing_Date || "No closing date";

  const accountName = getDealAccountName(deal.Account_Name);

  const titleElement = document.createElement("strong");

  titleElement.textContent = dealName;

  card.appendChild(titleElement);

  const details = [
    `Stage: ${stage}`,
    `Amount: ${amount}`,
    `Closing Date: ${closingDate}`,
    `Account: ${accountName}`,
  ];

  details.forEach(function (detail) {
    const detailElement = document.createElement("small");

    detailElement.textContent = detail;

    card.appendChild(detailElement);
  });

  return card;
}

/* ==================================================
   DEAL FIELD HELPERS
================================================== */

function getDealAccountName(accountLookup) {
  if (
    accountLookup &&
    typeof accountLookup === "object" &&
    accountLookup.name
  ) {
    return accountLookup.name;
  }

  if (typeof accountLookup === "string" && accountLookup.trim()) {
    return accountLookup;
  }

  return "No account";
}

function formatDealAmount(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "No amount";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return numericAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ==================================================
   MESSAGE
================================================== */

function showDealMessage(message) {
  if (!dealResultsContainer) {
    return;
  }

  dealResultsContainer.replaceChildren();

  const messageElement = document.createElement("p");

  messageElement.textContent = message;

  dealResultsContainer.appendChild(messageElement);
}
