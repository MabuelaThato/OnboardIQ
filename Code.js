/*************
 * Backend URL
 *************/
var BACKEND_URL = "https://onboardiq-backend-1-0-0.onrender.com"; 

/*************
 * Homepage: menu card
 *************/
function onHomepage(e) {
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Ticket System"));

  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Choose an action:"));

  // Button: Get tickets (by period)
  var actionTickets = CardService.newAction().setFunctionName("showTicketsForm");
  section.addWidget(CardService.newTextButton()
    .setText("Get My Tickets")
    .setOnClickAction(actionTickets));

  card.addSection(section);
  return [card.build()];
}

/*************
 * When email is opened → show "Create Ticket"
 *************/
function getContextualAddOn(e) {
  var messageId = e.gmail.messageId;
  var accessToken = e.gmail.accessToken;

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Ticket Actions"));

  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Create a ticket from this email."));

  var action = CardService.newAction()
    .setFunctionName("createTicket")
    .setParameters({ messageId: messageId, accessToken: accessToken });

  section.addWidget(CardService.newTextButton()
    .setText("Create Ticket")
    .setOnClickAction(action));

  card.addSection(section);
  return [card.build()];
}

/*************
 * Action: Create ticket
 *************/
function createTicket(e) {
  var messageId = e.parameters.messageId;

  var message = GmailApp.getMessageById(messageId);
  var acquisioner = message.getFrom();
  var transactioner = message.getTo();
  var clientInfo = message.getBody().substring(0, 500); // safe truncate

  var response = UrlFetchApp.fetch(BACKEND_URL + "/tickets", {
    method: "post",
    payload: {
      acquisioner: acquisioner,
      transactioner: transactioner,
      clientInfo: clientInfo
    },
    muteHttpExceptions: true
  });

  var resultText = response.getResponseCode() === 200
    ? "✅ Ticket created successfully."
    : "❌ Error: " + response.getContentText();

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Result"))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(resultText)));

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card.build()))
    .build();
}

/*************
 * UI: Get tickets form
 *************/
function showTicketsForm(e) {
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Get My Tickets"));

  var section = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setFieldName("period")
      .setTitle("Period (e.g., 7d, 30d)"));

  var action = CardService.newAction().setFunctionName("requestTicketsEmail");
  section.addWidget(CardService.newTextButton()
    .setText("Send Tickets Email")
    .setOnClickAction(action));

  card.addSection(section);
  return CardService.newNavigation().pushCard(card.build());
}

/*************
 * Call backend to email tickets
 *************/
function requestTicketsEmail(e) {
  var userEmail = Session.getActiveUser().getEmail();
  var period = e.formInput.period;

  var response = UrlFetchApp.fetch(BACKEND_URL + "/send-tickets-email", {
    method: "post",
    payload: {
      user: userEmail,
      period: period
    },
    muteHttpExceptions: true
  });

  var msg = response.getResponseCode() === 200
    ? "📨 Tickets email sent to " + userEmail
    : "❌ Error: " + response.getContentText();

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Result"))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(msg)));

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card.build()))
    .build();
}
