const { app } = require('@azure/functions');
const Handlebars = require('handlebars');
const { EmailClient } = require("@azure/communication-email");
const fs = require('fs');
const path = require('path');


const connectionString = "endpoint=https://ermmemail-adso.unitedstates.communication.azure.com/;accesskey=EjJoSvITPSvADJ2mcC0G7gta1B6O8Wdy68eu5M348x56xmOcdJhEJQQJ99AIACULyCps5mg0AAAAAZCStoIG";
const client = new EmailClient(connectionString);


app.http('httpTrigger1', {
    methods: ['POST'],
    handler: async (request, context) => {


        const requestData = await request.json();
        const subject = requestData.subject;
        const templateName = requestData.templateName;
        const dataTemplate = requestData.dataTemplate;
        const to = requestData.to;


        const templatePath = path.join(__dirname, templateName);
        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(source);
        const html = template({ name: dataTemplate.name });


        const emailMessage = {
                senderAddress: "DoNotReply@65733443-fafd-469e-b88d-f83a02f21e12.azurecomm.net",
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