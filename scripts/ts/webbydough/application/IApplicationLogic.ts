namespace WDOH {

    export interface IApplicationLogic {

        init() : void;

        //Returns whether the application logic has finished initialising and is ready to start running 
        canRun() : boolean;

        update(deltaTime : number) : void;

        //Events
        onEvent(event : AEvent) : void;
        
        onKeyEvent(keyEvent : KeyEvent) : void;

        onMouseEvent(mouseEvent : MouseEvent) : void;
        onMouseMoveEvent(mouseMoveEvent : MouseMoveEvent) : void;

        //An application would typically update camera projections and/or views
        onCanvasResize(aspectRatio : number) : void;

        //TODO:: call this function upon the end of the application's life
        cleanUp() : void;
    }
}