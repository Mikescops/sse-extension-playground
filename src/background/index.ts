import { browser } from 'webextension-polyfill-ts';
import { MessageType } from '../types';

// Temp storage for events
let eventsStorage: Event[] = [];

// SSE Listner
const events = new EventSource('http://localhost:3000/events');

events.onerror = (event) => {
    console.error('Failure establishing connection', event);
};

events.onmessage = (event) => {
    let parsedData;

    try {
        parsedData = JSON.parse(event.data);
    } catch (error) {
        console.error(error);
    }

    console.log('Data from server: ', parsedData);

    // at first connection an array is sent
    if (Array.isArray(parsedData)) {
        eventsStorage = parsedData;
        return;
    }

    eventsStorage.push(parsedData);
    browser.runtime
        .sendMessage({ type: 'EVENT_NOTIFICATION', event: parsedData })
        .then()
        .catch((error) => console.error('Sending message to frontend: ', error.message));
};

// Browser Components Listner
browser.runtime.onMessage.addListener((message: MessageType) => {
    switch (message.type) {
        case 'REQ_EVENTS':
            browser.runtime
                .sendMessage({ type: 'EVENTS', events: eventsStorage })
                .then()
                .catch((error) => console.error(error));
            break;
        default:
            break;
    }
});

export {};
