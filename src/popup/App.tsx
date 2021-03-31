import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader';
import { browser } from 'webextension-polyfill-ts';
import { Event, MessageType } from '../types';

import './style.css';

const App = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        browser.runtime
            .sendMessage({ type: 'REQ_EVENTS' })
            .then()
            .catch((error) => console.error(error));

        browser.runtime.onMessage.addListener((message: MessageType) => {
            switch (message.type) {
                case 'EVENTS':
                    setEvents(message.events);
                    break;
                case 'EVENT_NOTIFICATION':
                    setEvents((prev) => [...prev, message.event]);
                    break;
                default:
                    break;
            }
        });
    }, []);

    return (
        <div className="container">
            <h1>Server Sent Events in Extension - Playground</h1>

            <h3>Push a new event to server:</h3>
            <pre className="code-block">
                {'curl -X POST  -H "Content-Type: application/json"  -d ' +
                    '\'{"info": "New data available", "source": "https://api.service.com"}\' ' +
                    '-s http://localhost:3000/fact'}
            </pre>

            <h2>Events</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        {event.info} (
                        <a href={event.source} target="_blank" rel="noreferrer">
                            source
                        </a>
                        )
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default hot(module)(App);
