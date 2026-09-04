## Zoho SDK Initialization and JavaScript Execution Order

While implementing KPI cards and the Recent Accounts section, the dashboard stopped loading some functionality.

The Zoho CRM module API names were initially suspected:

- `Leads`
- `Accounts`
- `Deals`

However, the API names were correct.

The actual problem was the JavaScript execution order.

The KPI function was originally executed immediately while the JavaScript file was loading:

```javascript
loadKpis();
At that moment, the Zoho CRM SDK had not necessarily finished initializing. If the KPI request failed before the remaining code was evaluated, the event listener for the Load Accounts button was never registered.

The corrected sequence is:

Load the HTML.
Load the JavaScript file.
Register the button event listeners.
Initialize the Zoho CRM SDK.
Wait for initialization to complete.
Load data from the CRM APIs.

The KPI function is now called only after successful initialization:
ZOHO.embeddedApp
  .init()
  .then(() => {
    status.textContent = "Connected to Zoho CRM ✅";
    loadKpis();
  });
 ----
Main Lesson

Code that depends on an external SDK should not execute until that SDK has completed its initialization.

Event listeners for interface controls should be registered before starting operations that could fail and interrupt the remaining JavaScript execution.

```
