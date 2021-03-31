export interface Event {
    info: string;
    source: string;
}

interface EventsRequest {
    type: 'REQ_EVENTS';
}

interface EventsResponse {
    type: 'EVENTS';
    events: Event[];
}

interface EventNotifications {
    type: 'EVENT_NOTIFICATION';
    event: Event;
}

export type MessageType = EventsRequest | EventsResponse | EventNotifications;
