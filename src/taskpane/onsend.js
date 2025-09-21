Office.initialize = function () {};

function onMessageSendHandler(event) {
    Office.context.mailbox.item.from.getAsync(result => {
        const acquisioner = result.value.emailAddress;

        Office.context.mailbox.item.to.getAsync(result => {
            const transactioner = result.value[0].emailAddress; // Assume first recipient

            Office.context.mailbox.item.body.getAsync("text", result => {
                const clientInfo = result.value;

                fetch('http://localhost:7000/tickets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `acquisioner=${acquisioner}&transactioner=${transactioner}&clientInfo=${encodeURIComponent(clientInfo)}`
                })
                .then(response => {
                    if (response.ok) {
                        event.completed({ allowEvent: true });
                    } else {
                        event.completed({ allowEvent: false, errorMessage: "Failed to create ticket." });
                    }
                })
                .catch(error => {
                    event.completed({ allowEvent: false, errorMessage: "Network error." });
                });
            });
        });
    });
}