import { WebSocket } from "ws";
import { Chess, WHITE } from "chess.js"
import { GAME_OVER, MOVE } from "./messages";

interface game{
    id:number;
    name:string;
    player1:WebSocket;
    player2:WebSocket;
    
}

export class Game{

    public player1:WebSocket;
    public player2:WebSocket;
    private board:Chess;    
    private startTime:Date;


    constructor(player1:WebSocket,player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date;

        }


    makeMove(socket:WebSocket, move:{
        from:string;
        to:string;
    }){


        console.log(this.board.moves().length);
        
        if(this.board.turn()=== "w" && socket !== this.player1){
            console.log("returning early1");
            
            return;
        }
        if(this.board.turn()=== "b" && socket !== this.player2){
            console.log("returning early2");
            return;
        }

        try {
        
            console.log("here atleast");
            this.board.move(move);

            console.log("move made");
            
            
        } catch (error) {
            console.log("error caught");
            
            return;

        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"white"
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"white"
                }
            }))

            console.log("game has been ended");
            
            return;
        }

        if(socket==this.player1){
            console.log("making move normally");
            
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }

    }

    
    
}