const status = document.getElementById("crm-status");

window.onload = () => {
  if (!window.ZOHO) {
    status.textContent = "Running locally...";
    return;
  }

  ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log(data);

    status.textContent = "Connected to Zoho CRM ✅";
  });

  ZOHO.embeddedApp.init();
};
