import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from '../WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
@ccclass('RoomPlayerController')
export class RoomPlayerController extends Component {
    @property(Label)
    notify: Label = null;
    start() {
        webSocketController.on('open', this.onWebSocketOpen.bind(this));
        webSocketController.on('message', this.onWebSocketMessage.bind(this));
        webSocketController.on('close', this.onWebSocketClose.bind(this));
        webSocketController.on('error', this.onWebSocketError.bind(this));
    }
    private onWebSocketOpen(): void {
        console.log('WebSocket connection opened');
    }

    private onWebSocketMessage(data: any): void {
        console.log('WebSocket message_:', data);
        // handle message here
        switch (data.eventType) {
            case 'roomRemoved':
                director.loadScene('menuMain');
                break;
            case 'playerJoined':
                if (this.notify) {
                    this.notify.string = `${data.numberOfPlayers}/5 players. Watting for player123... `;
                }
                break;
            case 'startGame':
                director.loadScene('5VS5');
                break;
            case 'mess':
                this.notify.string = `some thing error`;
                break;
            default:
                console.log(`Unhandled message type: ${data.eventType}`);
                break;
        }
    }

    private onWebSocketClose(code: number, reason: string): void {
        console.log('WebSocket connection close_1:', code, reason);
    }

    private onWebSocketError(event: Event): void {
        console.error('WebSocket error:', event);
    }
    update(deltaTime: number) {

    }
}


