import { _decorator, Component, Node, Prefab, instantiate, RigidBody, Vec3 } from 'cc';
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

    private time: number = 0;
    private timeRemaining: number;
    private isGameStarted: boolean = false;
    start() {
        // Create prefabs at random positions
        for (let i = 0; i < this.maxPrefabs; i++) {
            // Get a random prefab from the list
            const randomIndex = Math.floor(Math.random() * this.prefabList.length);
            const randomPrefab = this.prefabList[randomIndex];

            // Instantiate the prefab
            const newPrefab = instantiate(randomPrefab);

            // Get a random position within the screen boundaries
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomY = Math.random() * (maxY - minY) + minY;
            const randomZ = Math.random() * (maxZ - minZ) + minZ;
            const randomPosition = new Vec3(i, i / 2, randomZ);

            // Set the position of the new prefab
            newPrefab.setPosition(randomPosition);

            // Add the new prefab to the scene
            this.node.addChild(newPrefab);
        }
        this.generate();
        this.randomCoins();
    }
    randomCoins(){
        for (let i = 0; i < 10; i++) {
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
    generate() {
        const angleStep = 10;
        const spiralRadiusStep = 0.1;
        const heightStep = 0.1;
        const center = new Vec3(0, -this.boundary, 0);

        for (let i = 0; i < 360; i += angleStep) {
            const angle = i * Math.PI / 180;
            const x = center.x + this.radius * Math.cos(angle);
            const y = center.y + this.time * this.speed + this.height * i / angleStep;
            const z = center.z + this.radius * Math.sin(angle);

            const spiralRadius = spiralRadiusStep * i / angleStep;
            const heightOffset = heightStep * i / angleStep;
            const position = new Vec3(x + Math.sin(this.time + spiralRadius) * spiralRadius, y + heightOffset , z/2 + 1 + Math.cos(this.time + spiralRadius) * spiralRadius);

            const node = instantiate(this.prefabList[5]);
            node.setPosition(position);
            this.node.addChild(node);
        }

        this.time += 0.1;
    }
    endGame() {
        this.isGameStarted = false;
        // Do something to end the game, such as showing a score screen or resetting the game.
        // ...
    }
}


