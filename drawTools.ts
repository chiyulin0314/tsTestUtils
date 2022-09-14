import { _decorator, Component, Node, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('drawTools')
export class drawTools {
    static fillRect(graphics: Graphics,x: number,y: number,w: number,h: number){
        if(graphics == null || typeof graphics.fillRect !== 'function'){
            return false;
        }else if(x == null){
            return false;
        }else if(y == null){
            return false;
        }else if(w == null){
            return false;
        }else if(h == null){
            return false;
        }

        graphics.fillRect(x,y,w,h);
        return true;
    }

    static stroke(graphics: Graphics,x: number,y: number,w: number,h: number){
        if(graphics == null || typeof graphics.rect !== 'function' || typeof graphics.stroke !== 'function'){
            return false;
        }else if(x == null){
            return false;
        }else if(y == null){
            return false;
        }else if(w == null){
            return false;
        }else if(h == null){
            return false;
        }

        graphics.rect(x,y,w,h);
        graphics.stroke();
        return true;
    }
}
