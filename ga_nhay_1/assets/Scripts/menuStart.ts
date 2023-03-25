import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menuStart')
export class menuStart extends Component {

    onload(){
        
    }
    Login(){
        director.loadScene('loginForm');
    }
    Register(){
        director.loadScene('registerForm');
    }
}


