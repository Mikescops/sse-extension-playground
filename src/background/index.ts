import { browser } from 'webextension-polyfill-ts';
import { MessageType } from '../types';

// Temp storage for events
let eventsStorage: Event[] = [];

// SSE Listner
const events = new EventSource('http://localhost:3000/events');
events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);

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
        .catch((error) => console.error(error));
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
