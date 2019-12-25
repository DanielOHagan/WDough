namespace wDOH {

    export interface ICameraController {

        onUpdate(deltaTime : number) : void;

        onWindowResize(aspectRation : number) : void;

        translatePosition(translation : Vector3) : void;
        setPosition(pos : Vector3) : void;
        getPosition() : Vector3;
        setTranslationSpeed(translationSpeed : number) : void;
        getTranslationSpeed() : number;

        rotateDegress(rotation : number) : void;
        setRotation(rotation : number) : void;
        getRotation() : number;
        setRotationSpeed(rotationSpeed : number) : void;
        getRotationSpeed() : number;

        setZoomScale(scale : number) : void;
        getZoomScale() : number;
        setZoomMax(maxZoom : number) : void;
        getZoomMax() : number;
        setZoomMin(zoomMin : number) : void;
        getZoomMin() : number;

        getCamera() : ICamera;

    }
}