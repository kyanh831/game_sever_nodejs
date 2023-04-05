import { EventTarget } from 'cc';
export class WebSocketController extends EventTarget {
    private static instance: WebSocketController;
    private socket: WebSocket;
    constructor(url: string) {
        super();
        this.socket = new WebSocket(url);
        this.socket.addEventListener('open', this.onOpen.bind(this));
        this.socket.addEventListener('message', this.onMessage.bind(this));
        this.socket.addEventListener('close', this.onClose.bind(this));
        this.socket.addEventListener('error', this.onError.bind(this));
    }
    public static getInstance(url: string): WebSocketController {
        if (!WebSocketController.instance) {
          WebSocketController.instance = new WebSocketController(url);
        }
        return WebSocketController.instance;
    }

    private onOpen(event: Event): void {
        console.log('WebSocket connection opened');
    }

    private onMessage(event: MessageEvent): void {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);
        this.emit('message', message);
    
    }

    private onClose(event: CloseEvent): void {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.emit('close', event.code, event.reason);
    }

    private onError(event: Event): void {
        console.error('WebSocket error:', event);
        this.emit('error', event);
    }

    public send(data: any): void {
        const message = JSON.stringify(data);
        this.socket.send(message);
        console.log('WebSocket message sent:', message);
    }

    public close(): void {
        this.socket.close();
    }
    
}
