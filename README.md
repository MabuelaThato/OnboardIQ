# TicketSystem

## Setup
- Update email credentials in EmailService.java.
- Sideload manifest.xml in Outlook.
- Run backend with `mvn clean package` then `java -jar backend/target/ticketsystem-1.0-SNAPSHOT-jar-with-dependencies.jar`.
- For Docker: Build and run as above.
- GitHub Actions: Set secrets DOCKER_USERNAME and DOCKER_PASSWORD.

## Features
- On email send (forward), creates ticket and sends form email.
- Form submission updates ticket and sends completion emails.
- Task pane to request ticket summary email.