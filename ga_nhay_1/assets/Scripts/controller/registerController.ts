import { _decorator, Button, Component, director, EditBox, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from '../WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
@ccclass('registerController')
export class registerController extends Component {
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
    notify: Label = null;
    @property(Label)
    notifyUserName: Label = null;
    @property(Label)
    notifyFullName: Label = null;
    @property(Label)
    notifyPassWord: Label = null;

    onload() {
        this.btnLogin.node.on('click', this.login, this.btnLogin)
        this.btnRegister.node.on('click', this.register, this.btnRegister)
    }
    start() {
        if (this.btnRegister != null)
            this.btnRegister.interactable = false;
        this.fullName.node.on('editingDidChanged', this.fullNameChange.bind(this));
        this.userName.node.on('editingDidChanged', this.userNameChange.bind(this));
        this.password.node.on('editingDidChanged', this.passwordChange.bind(this));
        webSocketController.on('open', this.onWebSocketOpen.bind(this));
        webSocketController.on('message', this.onWebSocketMessage.bind(this));
        webSocketController.on('close', this.onWebSocketClose.bind(this));
        webSocketController.on('error', this.onWebSocketError.bind(this));
    }
    fullNameChange(event: Event): void {
        if (this.fullName.string.trim().length < 1) {
            this.notifyFullName.string = 'This full name not empty';
            this.btnRegister.interactable = false;
        }
        else if (this.userName.string.trim().length < 1 || this.password.string.trim().length < 8) {
            this.btnRegister.interactable = false;
        } else {
            this.notifyFullName.string = '';
            this.btnRegister.interactable = true;
        }
    }
    userNameChange(event: Event): void {
        if (this.userName.string.trim().length < 1) {
            this.notifyUserName.string = 'This user name not empty';
            this.btnRegister.interactable = false;
        }
        else if (this.fullName.string.trim().length < 1 || this.password.string.trim().length < 8) {
            this.btnRegister.interactable = false;
        } else {
            this.notifyUserName.string = '';
            this.btnRegister.interactable = true;
        }
    }
    passwordChange(event: Event): void {
        if (this.password.string.trim().length < 8) {
            this.notifyPassWord.string = 'This password must be 8 characters long';
            this.btnRegister.interactable = false;
        }
        else if (this.userName.string.trim().length < 1 || this.fullName.string.trim().length < 1) {
            this.btnRegister.interactable = false;
        } else {
            this.notifyPassWord.string = '';
            this.btnRegister.interactable = true;
        }
    }
    private onWebSocketOpen(): void {
        console.log('WebSocket connection opened');
    }

    private onWebSocketMessage(data: any): void {
        console.log('WebSocket message_:', data);
        // handle message here
        switch (data.eventType) {
            case 'registered':
                if (this.notify != null)
                    this.notify.string = 'Registration successful';
                director.loadScene('loginForm');
                break;
            case 'mess':
                if (this.btnRegister != null)
                    this.btnRegister.interactable = true;
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

    login() {
        director.loadScene('loginForm');
    }

    async register() {
        this.btnRegister.interactable = false;
        var data = {
            eventType: 'register',
            player: {
                fullName: this.fullName.string,
                userName: this.userName.string,
                password: this.password.string
            }
        }
        console.log(data)
        webSocketController.send(data);
    }

}


