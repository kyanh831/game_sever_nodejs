import { _decorator, Component, Node, ColliderComponent, Collider, director } from 'cc';
import { ActorController } from './ActorController';
const { ccclass, property } = _decorator;

@ccclass('CoinController')
export class CoinController extends Component {
    @property({ type: Number })
    scoreToAdd: number = 10;
    collider: Collider;

    onload(){
    }

    // start(){
    //     this.collider = this.node.getComponent(Collider);
    //     this.collider?.on("onCollisionEnter", this.onCollisionEnter, this);
    //     this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
    // }
    // onTriggerEnter(other:any) {
    //     console.log("click to coin:", this.node.name);
    //     this.node.destroy();
    // }
    // onCollisionEnter(other: Component, self: ColliderComponent) {
    //     console.log("click to coin:", other?.node?.name);
    //     if (other.node.name.startsWith('rooster_man_skin')) {
    //         const player = other.node.getComponent(ActorController);
    //         player?.updateScore(this.scoreToAdd);
    //         console.log("Coin touched:", player?.score);
    //         this.node.destroy(); // Remove the coin prefab
    //     }
    // }
}


