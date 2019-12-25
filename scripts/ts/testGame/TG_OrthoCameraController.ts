namespace TestGame {

    export class TG_OrthoCameraController implements wDOH.ICameraController {

        private mAspectRatio : number;
        
        private mZoomMax : number;
        private mZoomMin : number;
        private mZoomLevel : number;
        private mZoomScale : number;

        private mRotation : number;
        private mRotationSpeed : number;

        private mTranslationSpeed : number;
        private mPosition : wDOH.Vector3;

        private mCamera : wDOH.OrthographicCamera;

        public constructor(aspectRatio : number) {
            this.mZoomLevel = 1;
            this.mZoomScale = 0.3;
            this.mZoomMax = 3;
            this.mZoomMin = 0.25;
            this.mRotation = 0;
            this.mRotationSpeed = 0.2;
            this.mTranslationSpeed = 0.3;
            this.mPosition = new wDOH.Vector3(0, 0, 0);

            this.mAspectRatio = aspectRatio;
            this.mCamera = new wDOH.OrthographicCamera(
                -aspectRatio * this.mZoomLevel,
                aspectRatio * this.mZoomLevel,
                -this.mZoomLevel,
                this.mZoomLevel
            );
        }

        public onUpdate(deltaTime : number) : void {

        }

        public onWindowResize(aspectRatio : number) : void {
            this.mAspectRatio = aspectRatio;

            this.updateCamera();
        }

        public translatePosition(translation : wDOH.Vector3) : void {
            this.mPosition.x += translation.x * this.mTranslationSpeed;
            this.mPosition.y += translation.y * this.mTranslationSpeed;
            this.mPosition.z += translation.z * this.mTranslationSpeed;
        }

        public setPosition(pos : wDOH.Vector3) : void {
            this.mPosition = pos;
        }

        public getPosition() : wDOH.Vector3 {
            return this.mPosition;
        }

        public setTranslationSpeed(translationSpeed : number) : void {
            this.mTranslationSpeed = translationSpeed;
        }

        public getTranslationSpeed() : number {
            return this.mTranslationSpeed;
        }

        public rotateDegress(rotation : number) : void {
            this.mRotation += rotation * this.mRotationSpeed;
        }

        public setRotation(rotation : number) : void {
            this.mRotation = rotation;
        }

        public getRotation() : number {
            return this.mRotation;
        }

        public setRotationSpeed(rotationSpeed : number) : void {
            this.mRotationSpeed = rotationSpeed;
        }

        public getRotationSpeed() : number {
            return this.mRotationSpeed;
        }

        public setZoomScale(zoomScale : number) : void {
            this.mZoomScale = zoomScale;
        }

        public getZoomScale() : number {
            return this.mZoomScale;
        }

        public setZoomMax(zoomMax : number) : void {
            this.mZoomMax = zoomMax;
        }

        public getZoomMax() : number {
            return this.mZoomMax;
        }

        public setZoomMin(zoomMin : number) : void {
            this.mZoomMin = zoomMin;
        }

        public getZoomMin() : number {
            return this.mZoomMin;
        }

        public getCamera() : wDOH.ICamera {
            return this.mCamera;
        }

        private zoom(zoomAmount : number) : void {
            this.mZoomLevel -= zoomAmount * this.mZoomScale;

            //Clamp mZoomLevel
            if (this.mZoomLevel > this.mZoomMax) {
                this.mZoomLevel = this.mZoomMax;
            } else if (this.mZoomLevel < this.mZoomMin) {
                this.mZoomLevel = this.mZoomMin;
            }
    
            this.updateCamera();
        }

        private updateCamera() : void {
            this.mCamera.setProjection(
                -this.mAspectRatio * this.mZoomLevel,
                this.mAspectRatio * this.mZoomLevel,
                -this.mZoomLevel,
                this.mZoomLevel
            );
        }
    }
}