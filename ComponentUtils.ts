import { _decorator, Component, Node, __private, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComponentUtils')
export class ComponentUtils {
    /**
     * @zh 取得節點下指定路徑的Component
     */
     static getPathComponent<T extends Component>(node: Node, path: string, classConstructor: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>): T | null{
        if(node == null) return null;
        if(path == null || path.length <= 0) return null;
        return node.getChildByPath(path)?.getComponent(classConstructor);
    }

    /**
     * @zh 取得Button的事件處理格式
     */
     static getEventHandler(com: Component, funName: string, customData: string = null): EventHandler | null{
        if(com == null || com.node == null) return null;
        if(funName == null || funName.length <= 0) return null;

        var sIndex = com.name.lastIndexOf('<');
        var eIndex = com.name.lastIndexOf('>');
        if(sIndex < 0 || eIndex < 0 || sIndex + 1 >= eIndex) return null;

        var comName = com.name.substring(sIndex + 1, eIndex);
        console.log(`name: ${com.name.lastIndexOf('+')}, sIndex: ${sIndex}, eIndex: ${eIndex}, comName: ${comName}`);

        var eh = new EventHandler();
        eh.target = com.node;
        eh.component = comName;
        eh.handler = funName;
        if(customData != null && customData.length > 0){
            eh.customEventData = customData;
        }

        return eh;
    }
}

