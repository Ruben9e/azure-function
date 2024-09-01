const { app } = require('@azure/functions');
const Handlebars = require('handlebars');
const { EmailClient } = require("@azure/communication-email");
const fs = require('fs');
const path = require('path');

const connectionString = "Cke9K964jZiQLi7ss3M0ad5Yqy9cieNHp2dBAfEOXBc5N4zx8Q8kJQQJ99AIACULyCps5mg0AAAAAZCSgUG3";
const client = new EmailClient(connectionString);

app.http('httpTrigger1', {
    methods: ['POST'],
    handler: async (request, context) => {
        const requestData = await request.json();
        const subject = requestData.subject;
        const templateName = requestData.template;
        const dataTemplate = requestData.dataTemplate;
        const to = requestData.to;
        const templatePath = path.join(__dirname, templateName);
        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(source);
        const html = template({ name: dataTemplate.name });
        const emailMessage = {
            senderAddress: "d1550664-3ddb-4176-a2f9-6685f2056d2b.azurecomm.net",
            content: {
                subject: subject,
                html: html,
            },
            recipients: {
                to: [{ address: to }],
            },
        };
        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        return { body: `email sent successfully` };
    }
});