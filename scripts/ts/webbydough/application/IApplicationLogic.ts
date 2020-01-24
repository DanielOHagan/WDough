namespace WDOH {

    export interface IApplicationLogic {

        init() : void;

        update(deltaTime : number) : void;

        onEvent(event : IEvent) : void;

        //An application would typically update camera projections and/or views
        onCanvasResize(aspectRatio : number) : void;

        //TODO:: call this function upon the end of the application's life
        cleanUp() : void;
    }
}