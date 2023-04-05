import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loginController')
export class loginController extends Component {
    @property
    btnLogin: Button =null;
    @property
    btnRegister: Button =null;
    @property
    btnMainMenu: Button =null;

    start() {

    }

    update(deltaTime: number) {

    }
}


