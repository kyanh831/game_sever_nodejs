import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActorController')
export class ActorController extends Component {
    @property({ type: Number })
    score: number = 0;

    public get Score() {
        return this.score;
    }

    public updateScore(scoreToAdd: number) {
        this.score += scoreToAdd;
        console.log(this.score);
    }
    onCollisionEnter(other: any, self: any) {
        if (other.node.name.startsWith("map0_st_3")) { // Replace with the name of your prefab
            this.updateScore(5);
            console.log("Prefab touched:",this.Score);
            other.node.destroy(); // Remove the prefab
        }
    }
}


