import { _decorator, Button, Component, director, EditBox, Label, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from '../WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
@ccclass('RoomController')
export class RoomController extends Component {
    @property(Label)
    notify: Label = null;
    @property(Label)
    notifyCreateRoom: Label = null;
    @property(Label)
    notifyInRoom: Label = null;

    @property(Button)
    BtnJoinRoom: Button = null;

    @property(EditBox)
    txtRoomId: EditBox = null;

    start() {
        this.BtnJoinRoom.node.active = false;
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
            case 'roomCreated':
                if (this.notifyCreateRoom)
                    this.notifyCreateRoom.string = `Room created: ${data.roomId}`
                sys.localStorage.setItem('currentRoom', data.roomId);
                break;
            case 'findRoom':
                if (this.notify) {
                    if (!data.room) {
                        this.notify.string = "can't find room";
                        this.BtnJoinRoom.node.active = false;
                    }
                    else {
                        this.notify.string = "";
                        sys.localStorage.setItem('currentRoom', data.room.roomId),
                            this.BtnJoinRoom.node.active = true;
                    }
                }
                break;
            case 'roomJoined':
                director.loadScene('roomPlayer');
                break;
            case 'roomRemoved':
                sys.localStorage.removeItem('currentRoom');
                director.loadScene('menuMain');
                break;
            case 'playerJoined':
                if (this.notifyInRoom) {
                    this.notifyInRoom.string = `${data.numberOfPlayers}/5 players joined`;
                }
                break;
            case 'startGame':
                director.loadScene('5VS5');
                break;    
            case 'mess':
                this.notifyCreateRoom.string = `Can't create room`;
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

    backToMenu() {
        this.deleteRoom();
    }

    createRoom() {
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if (!token) {
            return;
        }
        const _id = token.player._id;
        var data = {
            type: 'game',
            eventType: 'createRoom',
            player: {
                id: _id
            }
        }
        webSocketController.send(data);
    }

    findRoom() {
        const roomId = this.txtRoomId.string;
        console.log(roomId);
        if (!roomId) return;
        var data = {
            type: 'game',
            eventType: 'findRoom',
            roomId: roomId
        }
        webSocketController.send(data);
    }
    joinRoom() {
        const roomId = sys.localStorage.getItem('currentRoom');
        if (!roomId) return;
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if (!token) {
            return;
        }
        const _id = token.player._id;
        var data = {
            type: 'game',
            eventType: 'joinRoom',
            roomId: roomId,
            playerId: _id
        }
        webSocketController.send(data);
    }
    deleteRoom() {
        const roomId = sys.localStorage.getItem('currentRoom');
        if (!roomId) {
            director.loadScene('menuMain');
            return;
        }
        var data = {
            type: 'game',
            eventType: 'deleteRoom',
            roomId: roomId
        }
        webSocketController.send(data);
    }
    startGame(){
        const roomId = sys.localStorage.getItem('currentRoom');
        if (!roomId) return;
        var data={
            type:'game',
            eventType:'startGame',
            roomId: roomId
        }
        webSocketController.send(data);
    }
}


