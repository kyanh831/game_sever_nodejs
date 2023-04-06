import { _decorator, Component, Node, director, Prefab, instantiate, Button, Label, sys } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketController } from './WebSocket';
const SERVER_URL = 'ws://localhost:3000';
const  webSocketController = WebSocketController.getInstance(SERVER_URL);

@ccclass('menuStart')
export class menuStart extends Component {
    @property(Prefab)
    prefab: Prefab = null;
    @property(Button)
    btnLogin: Button =null;
    @property(Button)
    btnLogout: Button =null;
    @property(Button)
    btnRegister: Button =null;
    @property(Button)
    btnMainMenu: Button =null;
    @property(Label)
    notify: Label = null;

    private fullName: String = null;
    private sessionToken: String = null;


    onload(){
        this.createPrefab();
    }
    start(){
        webSocketController.on('open', this.onWebSocketOpen.bind(this));
        webSocketController.on('message', this.onWebSocketMessage.bind(this));
        webSocketController.on('close', this.onWebSocketClose.bind(this));
        webSocketController.on('error', this.onWebSocketError.bind(this));
        this.btnMainMenu.node.active = false;
        const token = JSON.parse(sys.localStorage.getItem('token'));
        const player =token?.player;
        this.fullName = player?.FullName;
        this.sessionToken = token?.sessionToken;
        if(token) {
            this.btnRegister.node.active = false;
            this.btnLogin.node.active = false;
            this.btnMainMenu.node.active = true;
            this.notify.string = 'Xin chao:'+ this.fullName;
        }
    }
    private onWebSocketOpen(): void {
        console.log('WebSocket connection opened');
    }

    private onWebSocketMessage(data: any): void {
        console.log('WebSocket message_:', data);
        
    }

    private onWebSocketClose(code: number, reason: string): void {
        console.log('WebSocket connection close_1:', code, reason);
    }

    private onWebSocketError(event: Event): void {
        console.error('WebSocket error:', event);
    }

    Login(){
        director.loadScene('loginForm');
    }
    Register(){
        director.loadScene('registerForm');
    }
    MainMenu(){
        director.loadScene('menuMain');
    }
    
    createPrefab() {
        // Instantiate the prefab
        const prefabInstance = instantiate(this.prefab);
        // Add it to the scene or another node
        director.getScene().addChild(prefabInstance);
    }
    async logout() {
        var data = {
            eventType: 'logout',
            player: {
                playerID: sys.localStorage.getItem('playerID'),
                session: sys.localStorage.getItem('sessionToken')
            }
        }
        webSocketController.send(data);
        // code here
    }
}


