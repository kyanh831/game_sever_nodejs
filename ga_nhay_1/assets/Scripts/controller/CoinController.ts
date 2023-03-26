import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinController')
export class CoinController extends Component {
    @property({ type: Number })
    scoreToAdd: number = 10;

    onCollisionEnter(other: any, self: any) {
        if (other.node.name === 'player') {
            const playerController = other.node.getComponent('ActorController');
            playerController.updateScore(this.scoreToAdd);
            this.node.destroy();
        }
    }
}


