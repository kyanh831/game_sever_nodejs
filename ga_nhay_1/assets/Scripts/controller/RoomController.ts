import { _decorator, Button, Component, director, Label, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from '../WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
@ccclass('RoomController')
export class RoomController extends Component {
    @property(Label)
    notify: Label =null;
    @property(Label)
    notifyCreateRoom: Label =null;
    @property(Node)
    groupPlayers: Node =null;

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
            case 'updatedScore':
                
                break;
            case 'mess':
                
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

    backToMenu(){
        director.loadScene('menuMain');
    }

    createRoom(){
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if(!token){
            return;
        }
        const _id = token.player._id;
        const roomId =Math.random()*1000;
        var data={
            type:'game',
            eventType:'createRoom',
            player:{
                id:_id,
                roomId:roomId
            }
        }
        webSocketController.send(data);
    }

}


