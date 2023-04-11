import { _decorator, Component, Node, ITriggerEvent, ColliderComponent, Collider, ICollisionEvent, Label, LabelComponent, systemEvent, Prefab, SkeletalAnimation } from 'cc';
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

    onCollisionEnter (event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Coin") {
            console.log('Enter coin')
            this.node.emit('updateScore');
            event.otherCollider.node.destroy();
        }
        if (event.otherCollider.node.name == "aula") {
            console.log('Enter monster')
            this.node.emit('updateHealth');
            const animation = event.otherCollider.node.getComponent(SkeletalAnimation);
            animation.play('attack');
        }
    }
    onCollisionExit(event: ICollisionEvent) {
        if (event.otherCollider.node.name == 'aula') {
            console.log('Exit monster')
            const animation = event.otherCollider.node.getComponent(SkeletalAnimation);
            animation.play('run');
        }
      }
      
}


