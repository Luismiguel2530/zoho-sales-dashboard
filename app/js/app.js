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

  ZOHO.embeddedApp.on("PageLoad", () => {
    status.textContent = "Connected to Zoho CRM ✅";
  });

  ZOHO.embeddedApp.init();
};

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchText = document.getElementById("searchInput").value;

  alert(`Searching for: ${searchText}`);
});
