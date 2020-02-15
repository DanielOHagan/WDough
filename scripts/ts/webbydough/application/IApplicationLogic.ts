namespace WDOH {

    export interface IApplicationLogic {

        init() : void;

        //Returns whether the application logic has finished initialising and is ready to start running 
        canRun() : boolean;

        update(deltaTime : number) : void;

        onEvent(event : AEvent) : void;
        onKeyEvent(keyEvent : KeyEvent) : void;
        onMouseEvent(mouseEvent : WDOH.MouseEvent) : void;

        //An application would typically update camera projections and/or views
        onCanvasResize(aspectRatio : number) : void;

        //TODO:: call this function upon the end of the application's life
        cleanUp() : void;
    }
}