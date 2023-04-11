import { _decorator, Component, Node, Prefab, instantiate, RigidBody, Vec3, Label, ProgressBar, SkeletalAnimation, Button, director, sys } from 'cc';
import { WebSocketController } from '../WebSocket';
import { PlayerId } from '../PlayerId';
const SERVER_URL = 'ws://localhost:3000';
const webSocketController = WebSocketController.getInstance(SERVER_URL);
const { ccclass, property } = _decorator;
const minX = -10; // minimum x coordinate
const maxX = 10; // maximum x coordinate
const minY = 0; // minimum y coordinate
const maxY = 5; // maximum y coordinate
const minZ = -10; // minimum z coordinate
const maxZ = 10; // maximum z coordinate
@ccclass('GameManage')
export class GameManage extends Component {

    @property({ type: Prefab })
    coinsPrefab: Prefab = null;

    @property(Prefab)
    monsterPrefab: Prefab = null;

    @property(Prefab)
    playerPrefab: Prefab = null;

    @property(Number)
    maxPrefabs: number = 20;

    @property(Number)
    radius: number = 1.0;
    @property(Number)
    height: number = 0.2;
    @property(Number)
    boundary: number = 5.0;
    @property(Number)
    speed: number = 0.1;

    @property(ProgressBar)
    healthBar: ProgressBar = null;

    @property(Label)
    timerLabel: Label = null;

    @property(Label)
    scoreLabel: Label = null;

    @property(Node)
    player: Node = null;

    @property(Node)
    panelEndGame: Node = null;

    @property(Button)
    BtnEndGame: Button = null;

    @property(Label)
    scoreEndLabel: Label = null;


    private score = 0;
    private time: number = 90;
    private timer: number = 0;
    private health: number = 100;
    private coinCount: number = 0;
    private monsterCount: number = 0;
    private timeRemaining: number;
    private isGameStarted: boolean = false;

    private monsters: Node[] = [];
    private players: Node[] = [];
    private room: any = {};
    start() {
        webSocketController.on('open', this.onWebSocketOpen.bind(this));
        webSocketController.on('message', this.onWebSocketMessage.bind(this));
        webSocketController.on('close', this.onWebSocketClose.bind(this));
        webSocketController.on('error', this.onWebSocketError.bind(this));
        this.panelEndGame.active = false;
        this.player.on('updateScore', this.updateScore, this);
        this.player.on('updateHealth', this.updateHealth, this);
        this.randomCoins();
        this.getPlayers();
        //this.schedule(this.updatePos, 1, this.time, 0);

    }
    update(dt: number) {
        this.timer += dt;
        if (this.timer >= 1 / 30) {
          this.updatePos();
          this.timer = 0;
        }
    }
    private onWebSocketOpen(): void {
        console.log('WebSocket connection opened');
    }

    private onWebSocketMessage(data: any): void {
        console.log('WebSocket message_:', data);
        // handle message here
        const token = JSON.parse(sys.localStorage.getItem('token'));
        switch (data.eventType) {
            case 'updatePos':
                for (var i = 0; i < this.players.length; i++) {
                    const playerIdComponent = this.players[i].getComponent(PlayerId);
                    if (data.player.id == playerIdComponent.playerId) {
                        this.players[i].setPosition(data.player.pos);
                        this.players[i].setRotation(data.player.rota);
                        break;
                    }
                }
                break;
            case 'init':
                this.room = data.room;
                this.initPlayer();
                console.log('room:',this.room);
                break;
            case 'mess':
                if (this.scoreLabel != null)
                    this.scoreEndLabel.string = data.message;
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
    getPlayers() {
        var roomId = sys.localStorage.getItem('currentRoom');
        const token = JSON.parse(sys.localStorage.getItem('token'));
        var data = {
            type: 'inGame',
            eventType: 'init',
            roomId: roomId,
            playerId: token.player._id
        }
        webSocketController.send(data);
    }
    initPlayer() {
        for (var i = 0; i < this.room.players.length; i++) {
            const newPrefab = instantiate(this.playerPrefab);
            const randomPosition = new Vec3(-2.021, 2.822, 5.832);
            // Set the position of the new prefab
            newPrefab.setPosition(randomPosition.x+i,randomPosition.y+i,randomPosition.z+i);
            // Add the new prefab to the scene
            const playerId = this.room.players[i].id;
            const playerIdComponent = newPrefab.addComponent(PlayerId);
            playerIdComponent.playerId = playerId;
            this.node.addChild(newPrefab);
            this.players.push(newPrefab);
        }
    }
    updatePos() {
        const token = JSON.parse(sys.localStorage.getItem('token'));
        const roomId = JSON.parse(sys.localStorage.getItem('currentRoom'));
        var data = {
            type: 'inGame',
            eventType: 'updatePos',
            roomId: roomId,
            player: {
                id: token.player._id,
                pos: this.player.position,
                rota: this.player.rotation
            }
        }
        webSocketController.send(data);
    }
    updateTimer() {
        this.time -= 1;
        this.health -= 5;
        this.healthBar.progress = this.health / 100;
        if (this.time < 0 || this.health < 0) {
            this.endGame();
        } else {
            const seconds = Math.floor(this.time % 60);
            const minutes = Math.floor(this.time / 60);
            const formattedTime = `${minutes.toString()}:${seconds.toString()}`;
            this.timerLabel.string = `Time: ${formattedTime}`;
        }
    }
    randomCoins() {
        for (let i = 0; i < 100; i++) {
            // Instantiate the prefab
            const newPrefab = instantiate(this.coinsPrefab);

            // Get a random position within the screen boundaries
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomY = Math.random() * (maxY - minY) + minY;
            const randomZ = Math.random() * (maxZ - minZ) + minZ;
            const randomPosition = new Vec3(randomX, 1, randomZ);

            // Set the position of the new prefab
            newPrefab.setPosition(randomPosition);

            // Add the new prefab to the scene
            this.node.addChild(newPrefab);
        }
    }

    endGame() {
        this.isGameStarted = false;
        this.scoreEndLabel.string = `Điểm của bạn là: ${this.score}`
        this.panelEndGame.active = true;
        const components = this.player.getComponents(Component);
        for (const component of components) {
            component.enabled = false;
        }
    }
    updateScore() {
        this.score++;
        this.health += 10;
        this.healthBar.progress = this.health / 100;
        this.scoreLabel.string = `Score: ${this.score}`;
    }
    updateHealth() {
        this.score--;
        this.health -= 3;
        this.healthBar.progress = this.health / 100;
        this.scoreLabel.string = `Score: ${this.score}`;
    }

    gameOver() {
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if (!token) {
            this.scoreEndLabel.string = 'Opss, có lỗi gì đó, F5 lại trang xem';
            return;
        }
        const _id = token.player._id;
        var data = {
            eventType: 'updateScore',
            player: {
                _id: _id,
                score: this.score
            }
        }
        console.log(data);
        webSocketController.send(data);
    }
}


