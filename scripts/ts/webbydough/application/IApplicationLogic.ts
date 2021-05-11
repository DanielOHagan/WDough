namespace WDOH {

    export interface IApplicationLogic {

        init() : void;

        canRun() : boolean;

        update(deltaTime : number) : void;

        //Events
        onEvent(event : AEvent) : void;
        onKeyEvent(keyEvent : KeyEvent) : void;
        onMouseEvent(mouseEvent : MouseEvent) : void;
        onCanvasResize(aspectRatio : number) : void;

        cleanUp() : void;
    }
}
