import { _decorator, Button, Component, director, EditBox, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from '../WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
@ccclass('loginController')
export class loginController extends Component {
    @property(EditBox)
    userName: EditBox = null;
    @property(EditBox)
    password: EditBox = null;
    @property(Button)
    btnLogin: Button = null;
    @property(Button)
    btnRegister: Button = null;
    @property(Label)
    notify: Label = null;

    onload() {
        this.btnLogin.node.on('click', this.login, this.btnLogin)
        this.btnRegister.node.on('click', this.register, this.btnRegister)
    }
    start(){
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
            case 'logged':
                if (this.notify != null)
                    this.notify.string = 'Login successful';
                localStorage.setItem('token', JSON.stringify(data?.token));
                director.loadScene('menuMain');
                break;
            case 'mess':
                if (this.btnLogin != null)
                    this.btnLogin.interactable = true;
                if (this.notify != null)
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
        this.btnLogin.interactable = false;
        var data = {
            eventType: 'login',
            player: {
                userName: this.userName.string,
                password: this.password.string
            }
        }
        webSocketController.send(data);
        // code here
    }

    register() {
        director.loadScene('registerForm');
    }

}


