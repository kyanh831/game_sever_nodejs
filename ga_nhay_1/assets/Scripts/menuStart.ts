import { _decorator, Component, Node, director, Prefab, instantiate, Button, Label, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menuStart')
export class menuStart extends Component {
    @property(Prefab)
    prefab: Prefab = null;
    @property(Button)
    btnLogin: Button =null;
    @property(Button)
    btnRegister: Button =null;
    @property(Button)
    btnMainMenu: Button =null;
    @property(Label)
    notify: Label = null;

    private fullName: String = null;
    private token: String = null;

    onload(){
        this.createPrefab();
    }
    start(){
        this.btnMainMenu.node.active = false;
        const player = JSON.parse(sys.localStorage.getItem('player'));
        this.fullName = player?.FullName;
        this.token = sys.localStorage.getItem('sessionToken');
        if(this.token !=undefined && this.fullName !=undefined) {
            this.btnRegister.node.active = false;
            this.btnLogin.node.active = false;
            this.btnMainMenu.node.active = true;
            this.notify.string = 'Xin chao:'+ this.fullName;
        }
    }
    Login(){
        director.loadScene('loginForm');
    }
    Register(){
        director.loadScene('registerForm');
    }
    MainMenu(){
        director.loadScene('menuMain');
    }
    createPrefab() {
        // Instantiate the prefab
        const prefabInstance = instantiate(this.prefab);
        // Add it to the scene or another node
        director.getScene().addChild(prefabInstance);
    }
}


