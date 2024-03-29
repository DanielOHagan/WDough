namespace TestGame {

    export class TG_OrthoCameraController implements WDOH.ICameraController {

        private mAspectRatio : number;

        private mZoomMax : number;
        private mZoomMin : number;
        private mZoomLevel : number;
        private mZoomScale : number;

        private mRotation : number;

        private mTranslationSpeed : number;
        private mPosition : WDOH.Vector3;

        private mCamera : WDOH.OrthographicCamera;

        public constructor(aspectRatio : number) {
            this.mZoomLevel = 1;
            this.mZoomScale = 1;
            this.mZoomMax = 3;
            this.mZoomMin = 0.25;
            this.mRotation = 0;
            this.mTranslationSpeed = 0.3;
            this.mPosition = new WDOH.Vector3(0, 0, 0);

            this.mAspectRatio = aspectRatio;
            this.mCamera = new WDOH.OrthographicCamera(
                -aspectRatio * this.mZoomLevel,
                aspectRatio * this.mZoomLevel,
                -this.mZoomLevel,
                this.mZoomLevel
            );
        }

        public onUpdate(deltaTime : number) : void {
            //Input Polling exmaple
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_W)) {
                this.translatePosition(new WDOH.Vector3(0, 4 * deltaTime, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_S)) {
                this.translatePosition(new WDOH.Vector3(0, -4 * deltaTime, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_D)) {
                this.translatePosition(new WDOH.Vector3(4 * deltaTime, 0, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_A)) {
                this.translatePosition(new WDOH.Vector3(-4 * deltaTime, 0, 0));
            }

            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_Q)) {
                this.rotateDegrees(-5 * deltaTime);
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_E)) {
                this.rotateDegrees(5 * deltaTime);
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_Z)) {
                this.zoom(this.mZoomScale * deltaTime)
            }

            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_X)) {
                this.zoom(-this.mZoomScale * deltaTime)
            }

            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_R)) {
                this.mRotation = 0;
            }

            this.mCamera.setRotation(this.mRotation);
            this.mCamera.setPosition(this.mPosition);
        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mAspectRatio = aspectRatio;

            this.updateProjection();
        }

        public translatePosition(translation : WDOH.Vector3) : void {
            this.mPosition.x += translation.x * this.mTranslationSpeed;
            this.mPosition.y += translation.y * this.mTranslationSpeed;
            this.mPosition.z += translation.z * this.mTranslationSpeed;
        }

        public setPosition(pos : WDOH.Vector3) : void {
            this.mPosition = pos;
        }

        public getPosition() : WDOH.Vector3 {
            return this.mPosition;
        }

        public setTranslationSpeed(translationSpeed : number) : void {
            this.mTranslationSpeed = translationSpeed;
        }

        public getTranslationSpeed() : number {
            return this.mTranslationSpeed;
        }

        public rotateDegrees(rotation : number) : void {
            this.rotateRads(WDOH.MathsWDOH.degToRad(rotation));
        }

        public rotateRads(rotation : number) : void {
            this.mRotation += rotation;
        }

        public setRotation(rotation : number) : void {
            this.mRotation = rotation;
        }

        public getRotation() : number {
            return this.mRotation;
        }

        public getZoomLevel() : number {
            return this.mZoomLevel;
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

        public getCamera() : WDOH.ICamera {
            return this.mCamera;
        }

        public zoom(zoomAmount : number) : void {
            this.mZoomLevel -= zoomAmount * this.mZoomScale;
            this.mZoomLevel = WDOH.MathsWDOH.clamp(this.mZoomLevel, this.mZoomMin, this.mZoomMax);

            //TODO : : Possible optimisation, even if the zoom is clamped and stays at the same min / max value, the projection mat is still re-calculated.
            // Maybe add a check to see if the zoom level changes then perform the updating.
            this.updateProjection();
        }

        private updateProjection() : void {
            this.mCamera.setProjection(
                -this.mAspectRatio * this.mZoomLevel,
                this.mAspectRatio * this.mZoomLevel,
                -this.mZoomLevel,
                this.mZoomLevel
            );
        }
    }
}
