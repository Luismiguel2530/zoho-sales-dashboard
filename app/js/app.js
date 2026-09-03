// const status = document.getElementById("crm-status");

// window.onload = () => {
//   if (!window.ZOHO) {
//     status.textContent = "Running locally...";
//     return;
//   }

//   ZOHO.embeddedApp.on("PageLoad", function (data) {
//     console.log(data);

//     status.textContent = "Connected to Zoho CRM ✅";
//   });

//   ZOHO.embeddedApp.init();
// };
// document.getElementById("searchBtn").addEventListener("click", () => {
//   const searchText = document.getElementById("searchInput").value;

//   console.log("Searching:", searchText);

//   alert(`Searching for: ${searchText}`);
// });
const status = document.getElementById("crm-status");

window.onload = () => {
  if (!window.ZOHO) {
    status.textContent = "Running locally...";
    return;
  }

  ZOHO.embeddedApp
    .init()
    .then(() => {
      status.textContent = "Connected to Zoho CRM ✅";
    })
    .catch(() => {
      status.textContent = "CRM Connection Failed ❌";
    });
};

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const searchText = document.getElementById("searchInput").value;

    alert(`Searching for: ${searchText}`);
  });
}

const loadLeadsBtn = document.getElementById("loadLeadsBtn");

if (loadLeadsBtn) {
  loadLeadsBtn.addEventListener("click", loadLeads);
}

function loadLeads() {
  const leadList = document.getElementById("lead-list");

  leadList.innerHTML = "Loading leads...";

  ZOHO.CRM.API.getAllRecords({
    Entity: "Leads",
  })
    .then(function (response) {
      leadList.innerHTML = "";

      if (!response.data || response.data.length === 0) {
        leadList.innerHTML = "<p>No leads found.</p>";

        return;
      }

      response.data.slice(0, 10).forEach((lead) => {
        const card = document.createElement("div");

        card.className = "lead-card";

        const leadName = lead.Full_Name || lead.Last_Name || "Unnamed Lead";

        card.innerHTML = `
          <strong>${leadName}</strong>
        `;

        leadList.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error(error);

      leadList.innerHTML = "<p>Error loading leads.</p>";
    });
}
