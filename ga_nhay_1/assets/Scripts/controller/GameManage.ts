import { _decorator, Component, Node, Prefab, instantiate, RigidBody, Vec3, Label, ProgressBar, SkeletalAnimation, Button, director, sys } from 'cc';
import { WebSocketController } from '../WebSocket';
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

    @property([Prefab])
    prefabList: Prefab[] = [];

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
    panelEndGame:Node = null;

    @property(Button)
    BtnReplay:Button = null;

    @property(Button)
    BtnEndGame:Button = null;

    @property(Label)
    scoreEndLabel:Label = null;
    
    private score = 0;
    private time: number = 90;
    private health: number = 100;
    private coinCount: number = 0;
    private monsterCount: number = 0;
    private timeRemaining: number;
    private isGameStarted: boolean = false;

    private monsters: Node[] = [];
    start() {
        // Create prefabs at random positions
        // for (let i = 0; i < this.maxPrefabs; i++) {
        //     // Get a random prefab from the list
        //     const randomIndex = Math.floor(Math.random() * this.prefabList.length);
        //     const randomPrefab = this.prefabList[randomIndex];

        //     // Instantiate the prefab
        //     const newPrefab = instantiate(randomPrefab);

        //     // Get a random position within the screen boundaries
        //     const randomX = Math.random() * (maxX - minX) + minX;
        //     const randomY = Math.random() * (maxY - minY) + minY;
        //     const randomZ = Math.random() * (maxZ - minZ) + minZ;
        //     const randomPosition = new Vec3(1, i / 2, randomZ);

        //     // Set the position of the new prefab
        //     newPrefab.setPosition(randomPosition);

        //     // Add the new prefab to the scene
        //     this.node.addChild(newPrefab);


        //     const player = this.node.parent.getChildByName('rooster_man_skin');
        //     if (!player) {
        //         console.error('Player not found!');
        //         return;
        //     }
        //     player.on('updateScore', this.updateScore, this);
        // }
        webSocketController.on('open', this.onWebSocketOpen.bind(this));
        webSocketController.on('message', this.onWebSocketMessage.bind(this));
        webSocketController.on('close', this.onWebSocketClose.bind(this));
        webSocketController.on('error', this.onWebSocketError.bind(this));
        this.panelEndGame.active = false;
        this.player.on('updateScore', this.updateScore, this);
        this.player.on('updateHealth', this.updateHealth, this);
        this.schedule(this.updateTimer, 1, this.time, 0);
        this.generate();
        this.randomCoins();
        this.randomMonster();
    }
    update(dt: number) {
        for (let i = 0; i < this.monsters.length; i++) {
            this.monsterLookAtPlayer(this.monsters[i]);
            this.monsterMoveToPlayer(dt, this.monsters[i]);
        }
    }
    private onWebSocketOpen(): void {
        console.log('WebSocket connection opened');
    }

    private onWebSocketMessage(data: any): void {
        console.log('WebSocket message_:', data);
        // handle message here
        switch (data.eventType) {
            case 'updatedScore':
                if (this.scoreEndLabel != null)
                    this.scoreEndLabel.string = 'update score successful';
                director.loadScene('menuMain');
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
    private monsterMoveToPlayer(dt: number, monster: Node) {
        const speed = 2;
        const distance = speed * dt;
        const direction = new Vec3();
        Vec3.subtract(direction, this.player.getWorldPosition(), monster.getWorldPosition());
        Vec3.normalize(direction, direction);
        Vec3.multiplyScalar(direction, direction, distance);

        monster.translate(direction);

    }
    private setMonsterAnimation(monster: Node, animationName: string) {
        const animationComponent = monster.getComponent(SkeletalAnimation);
        if (animationComponent) {
          animationComponent.getState(animationName).speed = 1.0;
          animationComponent.play(animationName);
        }
      }
    private monsterLookAtPlayer(monster: Node) {
        const direction = new Vec3();
        Vec3.subtract(direction, this.player.getWorldPosition(), monster.getWorldPosition());
        Vec3.negate(direction, direction); // Negate the direction vector
        monster.lookAt(monster.getWorldPosition().add(direction));
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
    randomMonster() {
        for (let i = 0; i < 10; i++) {
            // Instantiate the prefab
            const newPrefab = instantiate(this.monsterPrefab);
            // Get a random position within the screen boundaries
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomY = Math.random() * (maxY - minY) + minY;
            const randomZ = Math.random() * (maxZ - minZ) + minZ;
            const randomPosition = new Vec3(randomX, 1, randomZ);

            // Set the position of the new prefab
            newPrefab.setPosition(randomPosition);

            // Add the new prefab to the scene
            this.node.addChild(newPrefab);
            this.monsters.push(newPrefab);

        }
    }
    generate() {
        const angleStep = 10;
        const spiralRadiusStep = 0.1;
        const heightStep = 0.1;
        const center = new Vec3(0, 0, 0);

        for (let i = 0; i < 360; i += angleStep) {
            const angle = i * Math.PI / 180;
            const x = center.x + this.radius * Math.cos(angle);
            const y = center.y + this.time * this.speed + this.height * i / angleStep;
            const z = center.z + this.radius * Math.sin(angle);

            const spiralRadius = spiralRadiusStep * i / angleStep;
            const heightOffset = heightStep * i / angleStep;
            const position = new Vec3(x + Math.sin(this.time + spiralRadius) * spiralRadius, y + heightOffset, z / 2 + 1 + Math.cos(this.time + spiralRadius) * spiralRadius);

            const node = instantiate(this.prefabList[5]);
            node.setPosition(position);
            this.node.addChild(node);
        }

        this.time += 0.1;
    }
    endGame() {
        this.isGameStarted = false;
        this.scoreEndLabel.string = `Điểm của bạn là: ${this.score}`
        this.panelEndGame.active = true;
        const components =this.player.getComponents(Component);
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
    rePlayer(){
        director.loadScene('test');
    }
    gameOver(){
        const token = JSON.parse(sys.localStorage.getItem('token'));
        if(!token){
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


