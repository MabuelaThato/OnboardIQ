Office.onReady(() => {
    document.getElementById('getTickets').addEventListener('click', getTicketSummary);
});

function getTicketSummary() {
    Office.context.mailbox.userProfile.getAsync(result => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
            Office.context.ui.messageBox.showAsync('Failed to get user profile.', { behavior: 'prompt' });
            return;
        }
        const userEmail = result.value.emailAddress;
        const period = document.querySelector('input[name="period"]:checked').value;

        fetch('https://onboardiq-backend-1-0-0.onrender.com/send-tickets-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `user=${encodeURIComponent(userEmail)}&period=${encodeURIComponent(period)}`
        })
        .then(response => {
            if (response.ok) {
                Office.context.ui.displayDialogAsync('https://onboardiq-backend-1-0-0.onrender.com/static/success.html', 
                    { height: 20, width: 30 }, 
                    result => {
                        if (result.status === Office.AsyncResultStatus.Succeeded) {
                            result.value.addEventHandler(Office.EventType.DialogMessageReceived, () => {
                                result.value.close();
                            });
                        }
                    }
                );
            } else {
                Office.context.ui.messageBox.showAsync('Failed to request ticket summary.', { behavior: 'prompt' });
            }
        })
        .catch(error => {
            Office.context.ui.messageBox.showAsync('Network error: ' + error.message, { behavior: 'prompt' });
        });
    });
}