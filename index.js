const helpers = require('./helpers');
const messagingApi = require('./messaging_api');
const readline = require('readline');
// const chalk = require('chalk');
const name="Charon"
const displayedMessages = {};

const terminal = readline.createInterface({
    input: process.stdin,
});

terminal.on('line', text => {
    const username = name;
    const id = helpers.getRandomInt(10000);
    displayedMessages[id] = true;

    const message = {id, text, username};
    messagingApi.sendMessage(message);
});

function displayMessage(message) {
    console.log(`> ${message.username}: ${message.text}`);
    displayedMessages[message.id] = true;
}

async function getAndDisplayMessages() {
    const messages = await messagingApi.getMessages();

    for (const message of messages) {
        const messageAlreadyDisplayed = message.id in displayedMessages;
        if(!messageAlreadyDisplayed) displayMessage(message);
    }
}

function pollMessages() {
    setInterval(getAndDisplayMessages, 3000);
}

function streamMessages() {
    const messagingSocket = messagingApi.createMessagingSocket();

    messagingSocket.on('message', data => {
        const message = JSON.parse(data);
        const messageAlreadyDisplayed = message.id in displayedMessages;
        if (!messageAlreadyDisplayed) displayMessage(message);
    });
}


getAndDisplayMessages();
streamMessages();
