import { _decorator, Button, Component, director, EditBox, Label, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from './WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
@ccclass('mainMenu')
export class mainMenu extends Component {
    @property(Button)
    btnVs1: Button = null;
    @property(Button)
    btnVs5: Button = null;
    @property(Button)
    btnSetting: Button = null;
    @property(Button)
    btnLogout: Button = null;
    @property(Label)
    notifyName: Label = null;
    @property(Label)
    notifyScore: Label = null;
    onLoad(){
        this.getPlayerScore();
    }

    start() {
        const token = JSON.parse(sys.localStorage.getItem('token'));
        const player =token?.player;
        this.notifyName.string = 'Xin chao:'+ player?.FullName;
        this.notifyScore.string = 'Diem so:'+ player?.Score;
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
            case 'playerScore':
                if(this.notifyScore)
                    this.notifyScore.string = `Điểm: ${data.score}`
                break;
            case 'loggedOut':
                sys.localStorage.removeItem('token');
                director.loadScene('menuStart');
                break;
            case 'logoutMess':
                this.btnLogout.interactable= true;
                console.log('Error logout:',data?.name)
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
    getPlayerScore() {
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if(!token){
            return;
        }
        const _id = token.player._id;
        const data = {
            eventType:'playerScore',
            player:{
                _id:_id
            }
        }
        webSocketController.send(data);
    }
    Logout() {
        this.btnLogout.interactable = false;
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if (!token)
            director.loadScene('menuStart');
        else {
            const data = {
                eventType: 'logout',
                sessionToken: token.sessionToken
            }
            webSocketController.send(data);
        }
    }
}


