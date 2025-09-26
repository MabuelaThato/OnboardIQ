# OnboardIQ Gmail Add-on (Frontend)

OnboardIQ is an add-on that aims to eliminate the need for acquisition managers to manually keep track of the clients they have acquired and sent to transactional managers for onboarding.

This is the **Google Workspace Gmail Add-on frontend** built with **Google Apps Script**.  
The add-on integrates Gmail with the OnboardIQ ticketing system by allowing users to:
- Create a ticket directly from an email.
- View a menu card in Gmail.
- Request ticket summaries by email.
- Auto ticket closure by email form.

---

## 🚀 Features
- **Homepage card** → Main menu for accessing actions.
- **Contextual trigger** → Shows "Create Ticket" button when opening an email.
- **Backend integration** → Calls the OnboardIQ backend API for ticket creation and ticket email reports.
- **Email integration** → Emails acquisition managers when a ticket is closed, emails transactional managers a form to enter the client number once processing is completed(closes ticket).
