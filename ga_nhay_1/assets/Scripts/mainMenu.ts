import { _decorator, Button, Component, director, Label, Node, Prefab, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menu')
export class menu extends Component {
    
    @property(Button)
    btnVS1: Button =null;
    @property(Button)
    btnVS5: Button =null;
    @property(Button)
    btnSetting: Button =null;
    @property(Button)
    btnLogout: Button =null;
    @property(Label)
    notify: Label = null;

    private fullName: String = null;
    private token: String = null;

    start(){
        const player = JSON.parse(sys.localStorage.getItem('player') ?? 'null');
        this.fullName = player?.FullName;
        this.token = sys.localStorage.getItem('sessionToken');
    }

    update(deltaTime: number) {
        
    }

    Logout(){
        sys.localStorage.removeItem('sessionToken');
        sys.localStorage.removeItem('player');
        
        director.loadScene('menuStart');
    }
}


<<<<<<< HEAD

=======
>>>>>>> 2da60b7cdc535b5a773a602854e841d7af693add
