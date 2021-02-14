namespace WDOH {

    export interface ICameraController {

        onUpdate(deltaTime : number) : void;

        onCanvasResize(aspectRatio : number) : void;

        translatePosition(translation : Vector3) : void;
        setPosition(pos : Vector3) : void;
        getPosition() : Vector3;
        setTranslationSpeed(translationSpeed : number) : void;
        getTranslationSpeed() : number;

        rotateDegrees(rotation : number) : void;
        setRotation(rotation : number) : void;
        getRotation() : number;

        getZoomLevel() : number;
        setZoomScale(scale : number) : void;
        getZoomScale() : number;
        setZoomMax(maxZoom : number) : void;
        getZoomMax() : number;
        setZoomMin(zoomMin : number) : void;
        getZoomMin() : number;

        getCamera() : ICamera;

    }
}