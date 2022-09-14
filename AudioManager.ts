import { _decorator, Component, Node, AudioSource, clamp01, resources, AudioClip, assetManager, BaseNode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager {

    private static _instance: AudioManager = null;
    static get instance(): AudioManager {
        if(AudioManager._instance == null){
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    };
    
    public static IS_MD5: boolean = false;

    private _audioSource?: AudioSource;
    private _isMute: boolean = false;
    public get isMute(): boolean{
        return AudioManager.instance._isMute;
    }
    private _recordVolume: number;
    private _audioDic: Map<string, AudioClip> = new Map<string, AudioClip>();

    public get isValid(): boolean{
        return AudioManager.instance._audioSource != null && AudioManager.instance._audioSource.isValid;
    }

    public get isPlaying(): boolean{
        return AudioManager.instance._audioSource != null && AudioManager.instance._audioSource.playing;
    }

    init(node: BaseNode){
        if(node == null) return ;
        var aSource = node.getComponent(AudioSource);
        if(aSource == null){
            aSource = node.addComponent(AudioSource);
            aSource.playOnAwake = false;
        }

        this._isMute = false;
        AudioManager.instance._audioSource = aSource;
    }

    setNotDestroy(tf: boolean){

    }

    loadFromResource(path: string){
        if(AudioManager.instance.isValid == false) return null;
        if(path == null || path.length <= 0) return null;
        var key = AudioManager.IS_MD5 ? this.ConvertToMD5(path) : path;
        var isExist = this._audioDic.has(key) && this._audioDic.get(key) != null;
        if(isExist == false){
            resources.load(path, AudioClip, (err, aClip) => {
                if(err != null && err.message.length > 0){
                    console.error(`[AudioManager] loadFromResource - resources load error => message: ${err.message}`);
                }else{
                    this._audioDic.set(key, aClip);
                }
            });
        }
        return key;
    }

    loadFromBundle(nameOrUrl: string, name: string){
        if(AudioManager.instance.isValid == false) return null;
        if(nameOrUrl == null || nameOrUrl.length <= 0) return null;
        if(name == null || name.length <= 0) return null;
        var key = AudioManager.IS_MD5 ? this.ConvertToMD5(`${nameOrUrl}+${name}`) : `${nameOrUrl}+${name}`;
        var isExist = this._audioDic.has(key) && this._audioDic.get(key) != null;
        if(isExist == false){
            assetManager.loadBundle(nameOrUrl, (err, bundle) => {
                if(err != null && err.message.length > 0){
                    console.error(`[AudioManager] loadFromBundle - asset load error => message: ${err.message}`);
                }
                if(bundle != null){
                    bundle.load(name, AudioClip, (err, aClip) => {
                        if(err != null && err.message.length > 0){
                            console.error(`[AudioManager] loadFromBundle - bundle load error => message: ${err.message}`);
                        }
                        if(aClip != null){
                            this._audioDic.set(key, aClip);
                        }
                    });
                }
            });
        }
        return key;
    }

    playFromResource(path: string){
        if(AudioManager.instance.isValid == false) return null;
        if(path == null || path.length <= 0) return null;
        var key = AudioManager.IS_MD5 ? this.ConvertToMD5(path) : path;
        var isExist = this._audioDic.has(key) && this._audioDic.get(key) != null;
        if(isExist == false){
            resources.load(path, AudioClip, (err, aClip) => {
                if(err != null && err.message.length > 0){
                    console.error(`[AudioManager] playFromResource - resources load error => message: ${err.message}`);
                }else{
                    this._audioDic.set(key, aClip);
                    //AudioManager.instance._audioSource.clip = aClip;
                    this._play(key, aClip);
                }
            });
        }else{
            var aClip = this._audioDic.get(key);
            //AudioManager.instance._audioSource.clip = aClip;
            this._play(key, aClip);
        }
        return key;
    }

    playFromKey(key: string){
        if(AudioManager.instance.isValid == false) return false;
        if(key == null || key.length <= 0) return false;
        var aClip = this._audioDic.has(key) ? this._audioDic.get(key) : null;
        if(aClip != null){
            //AudioManager.instance._audioSource.clip = aClip;
            this._play(key, aClip);
        }
        return true;
    }

    playOnceFromResource(path: string, volume: number = 1){
        if(AudioManager.instance.isValid == false) return null;
        if(path == null || path.length <= 0) return null;
        var key = AudioManager.IS_MD5 ? this.ConvertToMD5(path) : path;
        var isExist = this._audioDic.has(key) && this._audioDic.get(key) != null;
        if(isExist == false){
            resources.load(path, AudioClip, (err, aClip) => {
                if(err != null && err.message.length > 0){
                    console.error(`[AudioManager] playOnceFromResource - resources load error => message: ${err.message}`);
                }else{
                    this._audioDic.set(key, aClip);
                    AudioManager.instance._audioSource.playOneShot(aClip, volume);
                }
            });
        }else{
            var aClip = this._audioDic.get(key);
            AudioManager.instance._audioSource.playOneShot(aClip, volume);
        }
        return key;
    }

    playOnceFromKey(key: string, volume: number = 1){
        if(AudioManager.instance.isValid == false) return false;
        if(key == null || key.length <= 0) return false;
        var aClip = this._audioDic.has(key) ? this._audioDic.get(key) : null;
        if(aClip != null){
            AudioManager.instance._audioSource.playOneShot(aClip, volume);
        }
        return true;
    }

    play(){
        //console.log(`play`);
        if(AudioManager.instance.isValid == false) return;
        AudioManager.instance._audioSource.play();
    }

    pause(){
        //console.log(`pause`);
        if(AudioManager.instance.isValid == false) return;
        AudioManager.instance._audioSource.pause();
    }

    stop(){
        //console.log(`stop`);
        if(AudioManager.instance.isValid == false) return;
        AudioManager.instance._audioSource.stop();
    }

    setVolume(volume: number){
        if(AudioManager.instance.isValid == false) return;
        var newVal = clamp01(volume);
        AudioManager.instance._audioSource.volume = newVal;
    }

    setLoop(tf: boolean){
        if(AudioManager.instance.isValid == false) return;
        AudioManager.instance._audioSource.loop = tf;
    }

    setMute(tf: boolean){
        if(AudioManager.instance.isValid == false) return;
        if(tf && this.isMute == false){
            this._isMute = true;
            this._recordVolume = AudioManager.instance._audioSource.volume;
            AudioManager.instance._audioSource.volume = 0;
        }else if(tf == false && this.isMute){
            this._isMute = false;
            AudioManager.instance._audioSource.volume = this._recordVolume;
        }
    }

    setPlayOnAwake(tf: boolean){
        if(AudioManager.instance.isValid == false) return;
        AudioManager.instance._audioSource.playOnAwake = tf;
    }

    private _play(key: string, aClip: AudioClip){
        if(this.isPlaying){
            this.stop();
        }
        AudioManager.instance._audioSource.clip = aClip;
        this.play();
    }

    private ConvertToMD5(str: string){
        //...
        return str;
    }
}

