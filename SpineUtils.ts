import { _decorator, Component, Node, sp, resources, assetManager, SpriteAtlas, Skeleton, Texture2D, Layers, Prefab, instantiate, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpineUtils')
export class SpineUtils {
    static DEFAULT_LAYER: number = Layers.Enum.UI_2D;

    static loadFromResource(path: string, parent: Node = null, callback: Function = null){
        if(path == null || path.length <= 0) return false;
        resources.load(path, sp.SkeletonData, (err, sData) => {
            if(err != null && err.message.length > 0){
                console.error(`[SpineUtils] loadFromResource - texture load error => message: ${err.message}`);
            }else{
                var node = new Node();
                node.layer = SpineUtils.DEFAULT_LAYER;
                var ske = node.addComponent(sp.Skeleton);
                ske.skeletonData = sData;

                if(parent != null){
                    parent.addChild(node);
                }

                if(callback != null){
                    callback(ske);
                }
            }
        });
        return true;
    }

    static loadFromRemote(path: string, parent: Node = null, callback: Function = null){
        if(path == null || path.length <= 0) return false;
        let imageUrl = `${path}.png`;
        let skeUrl = `${path}.json`;
        let atlasUrl = `${path}.atlas`;
        var index = imageUrl.lastIndexOf('/');
        var pngName = imageUrl.substring(index < imageUrl.length ? index + 1 : 0);
        //console.log(`imageUrl: ${imageUrl}, index: ${index}, pngName: ${pngName}`);
        assetManager.loadAny([{ url: atlasUrl, ext: '.txt' }, { url: skeUrl, ext: '.txt' }], (err, assets) => {
            if(err != null && err.message.length > 0){
                console.error(`[SpineUtils] loadFromRemote - atlas or skeleton load error => message: ${err.message}`);
            }
            assetManager.loadRemote(imageUrl, (error, texture: Texture2D) => {
                console.log(`loadFromRemote => width: ${texture.width}, height: ${texture.height}`);
                if(error != null && error.message.length > 0){
                    console.error(`[SpineUtils] loadFromRemote - image load error => message: ${error.message}`);
                }

                var asset = new sp.SkeletonData();
                asset.skeletonJson = assets[1];
                asset.atlasText = assets[0];
                asset.textures = [texture];
                asset.textureNames = [pngName];

                var node = new Node();
                node.layer = SpineUtils.DEFAULT_LAYER;
                var ske = node.addComponent(sp.Skeleton);
                ske.skeletonData = asset; //[Error]

                if(parent != null){
                    parent.addChild(node);
                }

                if(callback != null){
                    callback(ske);
                }
            });
        });
        return true;
    }

    static loadFromPrefab(path: string, parent: Node = null, callback: Function = null){
        if(path == null || path.length <= 0) return false;
        resources.load(path, Prefab, (err, prefab) => {
            if(err != null && err.message.length > 0){
                console.error(`[SpineUtils] loadFromPrefab - prefab load error => message: ${err.message}`);
            }
            if(prefab != null){
                var node = instantiate(prefab);
                if(parent != null){
                    parent.addChild(node);
                }

                if(callback != null){
                    var ske = node.getComponent(sp.Skeleton);
                    if(ske == null){
                        ske = node.getComponentInChildren(sp.Skeleton);
                    }
                    callback(ske);
                }
            }
        });
        return true;
    }

    static loadFromBundle(nameOrUrl: string, name: string, parent: Node = null, callback: Function = null){
        if(nameOrUrl == null || nameOrUrl.length <= 0) return false;
        if(name == null || name.length <= 0) return false;
        assetManager.loadBundle(nameOrUrl, (err, bundle) => {
            if(err != null && err.message.length > 0){
                console.error(`[SpineUtils] loadFromBundle - asset load error => message: ${err.message}`);
            }
            if(bundle != null){
                bundle.load(name, Prefab, (err, prefab) => {
                    if(err != null && err.message.length > 0){
                        console.error(`[SpineUtils] loadFromBundle - bundle load error => message: ${err.message}`);
                    }
                    if(prefab != null){
                        var node = instantiate(prefab);
                        if(parent != null){
                            parent.addChild(node);
                        }

                        if(callback != null){
                            var ske = node.getComponent(sp.Skeleton);
                            if(ske == null){
                                ske = node.getComponentInChildren(sp.Skeleton);
                            }
                            callback(ske);
                        }
                    }
                });
            }
        });
        return true;
    }

    static getSpineActions(skeleton: sp.Skeleton): string[]{
        var resArr: string[] = [];
        var dict = skeleton.skeletonData.getAnimsEnum();
        for (let key in dict) {
            if(key == null || key.length <= 0 || key == '<None>'){
                continue;
            }

            resArr.push(key);
        }

        return resArr;
    }
}

