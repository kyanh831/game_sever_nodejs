import { _decorator, Component, Node, ITriggerEvent, ColliderComponent, Collider, ICollisionEvent, Label, LabelComponent, systemEvent, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActorController')
export class ActorController extends Component {

    collider: Collider;

    @property(Prefab)
    Coin : Prefab = null;
    start(){
        this.collider = this.node.getComponent(Collider);
        this.collider?.on("onCollisionEnter", this.onCollisionEnter, this);

    }
    // onTriggerEnter(event: ICollisionEvent) {
    //     console.log('clicked');
    
    // }

    // public updateScore(scoreToAdd: number) {
    //     this.score += scoreToAdd;
    //     console.log(this.score);
    //     this.txtScore.string = 'Score: ' + this.score;
    // }

    // onCollisionEnter(other: any, self: any) {
    //     if (self?.node?.name === 'rooster_man_skin' && other?.node?.group === 'Coins') {
    //         console.log('Enter',self)
    //         this.node.emit('updateScore');
    //         other.node.destroy();
    //     }
    // }    
    onCollisionEnter (event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Coin") {
            console.log('Enter coin')
            this.node.emit('updateScore');
            event.otherCollider.node.destroy();
        }

    }
}


