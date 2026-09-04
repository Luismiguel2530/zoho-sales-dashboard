const status = document.getElementById("crm-status");

/* ==================================================
   ZOHO CRM INITIALIZATION
================================================== */

window.onload = () => {
  if (!window.ZOHO) {
    status.textContent = "Running locally...";
    return;
  }

  ZOHO.embeddedApp
    .init()
    .then(() => {
      status.textContent = "Connected to Zoho CRM ✅";

      /*
       * IMPORTANT:
       * Load KPI data only after Zoho CRM
       * has initialized successfully.
       */
      loadKpis();
    })
    .catch((error) => {
      console.error("CRM initialization error:", error);
      status.textContent = "CRM Connection Failed ❌";
    });
};

/* ==================================================
   SEARCH
================================================== */

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn) {
  searchBtn.addEventListener("click", handleSearch);
}

if (searchInput) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
}

function handleSearch() {
  const searchText = searchInput.value.trim();

  if (!searchText) {
    alert("Please enter something to search.");
    searchInput.focus();
    return;
  }

  alert(`Searching for: ${searchText}`);
}

/* ==================================================
   RECENT LEADS
================================================== */

const loadLeadsBtn = document.getElementById("loadLeadsBtn");

if (loadLeadsBtn) {
  loadLeadsBtn.addEventListener("click", loadLeads);
}

function loadLeads() {
  const leadList = document.getElementById("lead-list");

  leadList.textContent = "Loading leads...";

  ZOHO.CRM.API.getAllRecords({
    Entity: "Leads",
  })
    .then((response) => {
      leadList.replaceChildren();

      const leads =
        response && Array.isArray(response.data) ? response.data : [];

      if (leads.length === 0) {
        showMessage(leadList, "No leads found.");
        return;
      }

      leads.slice(0, 10).forEach((lead) => {
        const leadName = lead.Full_Name || lead.Last_Name || "Unnamed Lead";

        const company = lead.Company || "No company";
        const email = lead.Email || "No email";
        const phone = lead.Phone || "No phone";

        const card = createRecordCard(leadName, [
          `Company: ${company}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
        ]);

        leadList.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading leads:", error);

      leadList.replaceChildren();
      showMessage(leadList, "Error loading leads.");
    });
}

/* ==================================================
   RECENT ACCOUNTS

   This listener is registered before any KPI
   API calls are made.
================================================== */

const loadAccountsBtn = document.getElementById("loadAccountsBtn");

if (loadAccountsBtn) {
  loadAccountsBtn.addEventListener("click", loadAccounts);
}

function loadAccounts() {
  const accountList = document.getElementById("account-list");

  accountList.textContent = "Loading accounts...";

  ZOHO.CRM.API.getAllRecords({
    Entity: "Accounts",
  })
    .then((response) => {
      accountList.replaceChildren();

      const accounts =
        response && Array.isArray(response.data) ? response.data : [];

      if (accounts.length === 0) {
        showMessage(accountList, "No accounts found.");

        return;
      }

      accounts.slice(0, 10).forEach((account) => {
        const accountName = account.Account_Name || "Unnamed Account";

        const phone = account.Phone || "No phone";

        const website = account.Website || "No website";

        const card = createRecordCard(accountName, [
          `Phone: ${phone}`,
          `Website: ${website}`,
        ]);

        accountList.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading accounts:", error);

      accountList.replaceChildren();

      showMessage(accountList, "Error loading accounts.");
    });
}

/* ==================================================
   QUICK ACCESS
================================================== */

const newLeadBtn = document.getElementById("newLeadBtn");

const newDealBtn = document.getElementById("newDealBtn");

const newAccountBtn = document.getElementById("newAccountBtn");

if (newLeadBtn) {
  newLeadBtn.addEventListener("click", () => {
    ZOHO.CRM.UI.Record.create({
      Entity: "Leads",
    });
  });
}

if (newDealBtn) {
  newDealBtn.addEventListener("click", () => {
    ZOHO.CRM.UI.Record.create({
      Entity: "Deals",
    });
  });
}

if (newAccountBtn) {
  newAccountBtn.addEventListener("click", () => {
    ZOHO.CRM.UI.Record.create({
      Entity: "Accounts",
    });
  });
}

/* ==================================================
   KPI CARDS

   These functions are called from init().then(),
   never directly while app.js is loading.
================================================== */

function loadKpis() {
  loadLeadCount();
  loadAccountCount();
  loadDealCount();
}

function loadLeadCount() {
  const leadCount = document.getElementById("leadCount");

  if (!leadCount) {
    return;
  }

  leadCount.textContent = "...";

  ZOHO.CRM.API.getAllRecords({
    Entity: "Leads",
  })
    .then((response) => {
      const records =
        response && Array.isArray(response.data) ? response.data : [];

      leadCount.textContent = records.length;
    })
    .catch((error) => {
      console.error("Error loading Leads KPI:", error);

      leadCount.textContent = "Error";
    });
}

function loadAccountCount() {
  const accountCount = document.getElementById("accountCount");

  if (!accountCount) {
    return;
  }

  accountCount.textContent = "...";

  ZOHO.CRM.API.getAllRecords({
    Entity: "Accounts",
  })
    .then((response) => {
      const records =
        response && Array.isArray(response.data) ? response.data : [];

      accountCount.textContent = records.length;
    })
    .catch((error) => {
      console.error("Error loading Accounts KPI:", error);

      accountCount.textContent = "Error";
    });
}

function loadDealCount() {
  const dealCount = document.getElementById("dealCount");

  if (!dealCount) {
    return;
  }

  dealCount.textContent = "...";

  ZOHO.CRM.API.getAllRecords({
    Entity: "Deals",
  })
    .then((response) => {
      const records =
        response && Array.isArray(response.data) ? response.data : [];

      dealCount.textContent = records.length;
    })
    .catch((error) => {
      console.error("Error loading Deals KPI:", error);

      dealCount.textContent = "Error";
    });
}

/* ==================================================
   REUSABLE FUNCTIONS
================================================== */

function createRecordCard(title, details) {
  const card = document.createElement("div");
  card.className = "lead-card";

  const titleElement = document.createElement("strong");

  titleElement.textContent = title;
  card.appendChild(titleElement);

  details.forEach((detail) => {
    const detailElement = document.createElement("small");

    detailElement.textContent = detail;
    card.appendChild(detailElement);
  });

  return card;
}

function showMessage(container, message) {
  const paragraph = document.createElement("p");

  paragraph.textContent = message;
  container.appendChild(paragraph);
}
