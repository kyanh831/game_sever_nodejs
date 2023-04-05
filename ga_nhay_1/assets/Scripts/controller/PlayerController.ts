import { _decorator, Component, EditBox, Button, Label, director } from 'cc';
import { WebSocketController } from '../WebSocket';
const SERVER_URL = 'ws://localhost:3000';

const { ccclass, property } = _decorator;
@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(EditBox)
    fullName: EditBox = null;
    @property(EditBox)
    userName: EditBox = null;
    @property(EditBox)
    password: EditBox = null;
    @property(Button)
    btnLogin: Button = null;
    @property(Button)
    btnRegister: Button = null;
    @property(Label)
    notify: Label = null;;

    private webSocketController: WebSocketController = null;
    onload() {

        this.btnLogin.node.on('click', this.login, this.btnLogin)
        this.btnRegister.node.on('click', this.register, this.btnRegister)
    }

    start() {
        this.webSocketController = new WebSocketController(SERVER_URL);
        this.webSocketController.on('open', this.onWebSocketOpen.bind(this));
        this.webSocketController.on('message', this.onWebSocketMessage.bind(this));
        this.webSocketController.on('close', this.onWebSocketClose.bind(this));
        this.webSocketController.on('error', this.onWebSocketError.bind(this));
    }
    private onWebSocketOpen(): void {
        console.log('WebSocket connection opened');
    }

    private onWebSocketMessage(data: any): void {
        console.log('WebSocket message_:', data);
        // handle message here
        switch (data.eventType) {
            case 'logged':
                this.notify.string = 'Login successful';
                localStorage.setItem('sessionToken', data?.token);
                localStorage.setItem('player', JSON.stringify(data?.player));
                director.loadScene('menuMain');
                break;
            case 'registered':
                this.notify.string = 'Registration successful';
                director.loadScene('loginForm');
                break;
            case 'mess':
                this.notify.string = data.message;
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
    async login() {
        var data = {
            eventType: 'login',
            player: {
                userName: this.userName.string,
                password: this.password.string
            }
        }
        this.webSocketController.send(data);
        // code here
    }
    register() {
        var data = {
            eventType: 'register',
            player: {
                fullName: this.fullName.string,
                userName: this.userName.string,
                password: this.password.string
            }
        }
        console.log(data)
        this.webSocketController.send(data);
    }
    backToMenu() {
        director.loadScene('menuMain');
    }
    backToLogin() {
        director.loadScene('loginForm');
    }
    onDestroy() {
        if (this.webSocketController) {
            this.webSocketController.close();
            this.webSocketController = null;
        }
    }
}


