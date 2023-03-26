import { _decorator, Component, Node, EditBox, ButtonComponent, Button, Label, Socket, director } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(EditBox)
    fullName: EditBox;
    @property(EditBox)
    userName: EditBox;
    @property(EditBox)
    password: EditBox;
    @property(Button)
    btnLogin: Button;
    @property(Button)
    btnRegister: Button;
    @property(Label)
    notify:Label;
    
    @property()
    wsServer:String ='ws://localhost:3000';

    private client: WebSocket = null;

    onload(){
        this.client = new WebSocket('wss://localhost:3000');

        this.client.onopen =()=>{
            console.log('connected');
        }
        this.client.onerror =err=>{
            console.log(`error: ${err}`);
        }
        this.client.onmessage =mess=>{
            console.log('server message: ',mess);
        }   
        this.btnLogin.node.on('click', this.login,this.btnLogin)
        this.btnRegister.node.on('click', this.register,this.btnRegister)
    }

    start() {
    }
    update(deltaTime: number) {
        
    }

    login(){
        var data ={
            eventType: 'test',
            player : {
                username : this.userName.string,
                password : this.password.string
            }
        }   
        console.log("helo")
        console.log(data)
        this.notify.string="success"
    }
    register(){
        var data ={
            fullName : this.fullName.string,
            userName : this.userName.string,
            password : this.password.string
        }
        console.log(data)  
        
    }
    backToMenu(){
        director.loadScene('menuMain');
    }
    backToLogin(){
        director.loadScene('loginForm');
    }
}


