namespace WDOH {

    export interface IRenderer {

        init() : void;
        isReady() : boolean;
        beginScene(camera : ICamera) : void;
        endScene() : void;

    }
}
