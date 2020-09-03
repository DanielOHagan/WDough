namespace WDOH {

    export interface IRenderer {

        init() : void;

        beginScene(camera : ICamera) : void;
        endScene() : void;

    }
}