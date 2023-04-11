import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerId')
export class PlayerId extends Component {
    @property()
    playerId: string = '';
}


