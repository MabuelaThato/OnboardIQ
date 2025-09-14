Office.initialize = function () {};

function onMessageSendHandler(event) {
    Office.context.mailbox.item.from.getAsync(result => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
            event.completed({ allowEvent: false, errorMessage: "Failed to get sender." });
            return;
        }
        const acquisioner = result.value.emailAddress;

        Office.context.mailbox.item.to.getAsync(result => {
            if (result.status !== Office.AsyncResultStatus.Succeeded || result.value.length === 0) {
                event.completed({ allowEvent: false, errorMessage: "Failed to get recipient." });
                return;
            }
            const transactioner = result.value[0].emailAddress;

            Office.context.mailbox.item.body.getAsync("text", result => {
                if (result.status !== Office.AsyncResultStatus.Succeeded) {
                    event.completed({ allowEvent: false, errorMessage: "Failed to get email body." });
                    return;
                }
                const clientInfo = result.value;

                fetch('https://onboardiq-backend-1-0-0.onrender.com/tickets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `acquisioner=${encodeURIComponent(acquisioner)}&transactioner=${encodeURIComponent(transactioner)}&clientInfo=${encodeURIComponent(clientInfo)}`
                })
                .then(response => {
                    if (response.ok) {
                        event.completed({ allowEvent: true });
                    } else {
                        event.completed({ allowEvent: false, errorMessage: "Failed to create ticket." });
                    }
                })
                .catch(error => {
                    event.completed({ allowEvent: false, errorMessage: "Network error: " + error.message });
                });
            });
        });
    });
}