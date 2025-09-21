Office.onReady(() => {
    document.getElementById("getTickets").onclick = getTickets;
});

function getTickets() {
    const period = document.getElementById("period").value;
    const userEmail = Office.context.mailbox.userProfile.emailAddress;

    fetch('https://onboardiq-backend-1-0-0.onrender.com/send-tickets-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `user=${userEmail}&period=${period}`
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("status").innerText = "Email with tickets sent!";
        } else {
            document.getElementById("status").innerText = "Error sending request.";
        }
    })
    .catch(error => console.error('Error:', error));
}
