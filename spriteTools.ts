import { _decorator, Component, Node, Color, Texture2D, SpriteFrame, ImageAsset, rect, assetManager, Sprite, v2, size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('spriteTools')
export class spriteTools {
    
    static getDefaultSpriteFrame(width: number, height: number, color = Color.WHITE){
        
        var imageObj = new Image();
        imageObj.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==';
        var textureObj = new Texture2D();
        textureObj.image = new ImageAsset(imageObj);
        var sf = new SpriteFrame();
        sf.texture = textureObj;
        return sf;
        /*
        let texture = new Texture2D;
        let spriteFrame = new SpriteFrame;
        //texture.initWithData(new Uint8Array([color.r, color.g, color.b]), cc.Texture2D.PixelFormat.RGB888, 1, 1, cc.winSize);
        texture.initWithData(new Uint8Array([color.r, color.g, color.b]), Texture2D.PixelFormat.RGB888, 1, 1);
        spriteFrame.setTexture(texture);
        spriteFrame.setRect(rect(0, 0, width, height));
        return spriteFrame;
        */
    }
    /*
    static setDefaultSpriteFrame(sprite: Sprite, width: number, height: number, color = Color.WHITE){
        if(sprite == null) return false;
        
        const base = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==';
        assetManager.loadRemote(base, { ext: '.png' }, (err: Error, asset: Texture2D) => {
            var sf = new SpriteFrame();
            sf.texture = asset;
            sprite.spriteFrame = sf;
        });

        return true;
    }*/
}

