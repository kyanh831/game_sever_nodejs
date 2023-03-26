import { _decorator, Component, Node, director, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menuStart')
export class menuStart extends Component {
    @property(Prefab)
    prefab: Prefab = null;
    onload(){
        this.createPrefab();
    }
    Login(){
        director.loadScene('loginForm');
    }
    Register(){
        director.loadScene('registerForm');
    }
    createPrefab() {
        // Instantiate the prefab
        const prefabInstance = instantiate(this.prefab);
        // Add it to the scene or another node
        director.getScene().addChild(prefabInstance);
    }
}


