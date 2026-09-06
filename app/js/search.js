/* ==================================================
   DASHBOARD SEARCH

   This file is intentionally separated from app.js
   to keep the stable Zoho CRM logic unchanged.
================================================== */

const dashboardSearchInput = document.getElementById("searchInput");

const dashboardSearchButton = document.getElementById("searchBtn");

const leadResultsContainer = document.getElementById("lead-list");

const accountResultsContainer = document.getElementById("account-list");

/* ==================================================
   REGISTER SEARCH EVENTS
================================================== */

if (dashboardSearchButton) {
  /*
   * Capture mode allows search.js to handle the click
   * before the old alert listener inside app.js.
   */
  dashboardSearchButton.addEventListener(
    "click",
    function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      runDashboardSearch();
    },
    true,
  );
}

if (dashboardSearchInput) {
  dashboardSearchInput.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopImmediatePropagation();

        runDashboardSearch();
      }
    },
    true,
  );

  /*
   * If the input becomes empty, show every loaded
   * Lead and Account again.
   */
  dashboardSearchInput.addEventListener("input", function () {
    if (dashboardSearchInput.value.trim() === "") {
      resetDashboardSearch();
    }
  });
}

/* ==================================================
   SEARCH LOGIC
================================================== */

function runDashboardSearch() {
  if (!dashboardSearchInput) {
    console.error("Dashboard search input was not found.");
    return;
  }

  const searchTerm = dashboardSearchInput.value.trim().toLowerCase();

  removeSearchMessages();

  if (!searchTerm) {
    resetDashboardSearch();
    dashboardSearchInput.focus();
    return;
  }

  const leadMatches = filterRecordCards(leadResultsContainer, searchTerm);

  const accountMatches = filterRecordCards(accountResultsContainer, searchTerm);

  const totalMatches = leadMatches + accountMatches;

  if (totalMatches === 0) {
    showSearchMessage(
      `No results found for "${dashboardSearchInput.value.trim()}".`,
    );
  } else {
    showSearchMessage(
      `${totalMatches} result${totalMatches === 1 ? "" : "s"} found.`,
    );
  }
}

/* ==================================================
   FILTER RECORD CARDS
================================================== */

function filterRecordCards(container, searchTerm) {
  if (!container) {
    return 0;
  }

  const recordCards = container.querySelectorAll(".lead-card");

  let matchCount = 0;

  recordCards.forEach(function (card) {
    const cardText = card.textContent.toLowerCase().trim();

    const matches = cardText.includes(searchTerm);

    card.hidden = !matches;

    if (matches) {
      matchCount += 1;
    }
  });

  return matchCount;
}

/* ==================================================
   RESET SEARCH
================================================== */

function resetDashboardSearch() {
  removeSearchMessages();

  showAllCards(leadResultsContainer);
  showAllCards(accountResultsContainer);
}

function showAllCards(container) {
  if (!container) {
    return;
  }

  const recordCards = container.querySelectorAll(".lead-card");

  recordCards.forEach(function (card) {
    card.hidden = false;
  });
}

/* ==================================================
   SEARCH STATUS MESSAGE
================================================== */

function showSearchMessage(message) {
  const existingMessage = document.getElementById("searchStatus");

  if (existingMessage) {
    existingMessage.textContent = message;
    return;
  }

  const searchStatus = document.createElement("p");

  searchStatus.id = "searchStatus";
  searchStatus.textContent = message;

  const searchContainer = document.querySelector(".search-container");

  if (searchContainer) {
    searchContainer.insertAdjacentElement("afterend", searchStatus);
  }
}

function removeSearchMessages() {
  const existingMessage = document.getElementById("searchStatus");

  if (existingMessage) {
    existingMessage.remove();
  }
}
