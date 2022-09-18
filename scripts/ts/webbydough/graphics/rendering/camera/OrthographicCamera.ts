namespace WDOH {

    export class OrthographicCamera implements ICamera {

        private mProjectionMatrix : Matrix4x4;
        private mViewMatrix : Matrix4x4;
        private mProjectionViewMatrix : Matrix4x4;

        private mPosition : Vector3;
        private mRotation : number;

        public constructor(
            left : number,
            right : number,
            bottom : number,
            top : number,
            nearZ : number = -1,
            farZ : number = 1
        ) {
            this.mViewMatrix = new Matrix4x4();
            this.mProjectionMatrix = new Matrix4x4();
            this.mProjectionViewMatrix = new Matrix4x4();
            this.mPosition = new Vector3(0, 0, 0);
            this.mRotation = 0;

            this.setProjection(left, right, bottom, top, nearZ, farZ);
            this.updateProjectionViewMatrix();
        }

        public updateViewMatrix() : void {
            this.mViewMatrix.identity();
            this.mViewMatrix.translateVec3(this.mPosition);
            this.mViewMatrix.rotateRads(this.mRotation, new Vector3(0, 0, 1));
            this.mViewMatrix.inverse();
        }

        public updateProjectionViewMatrix() : void {
            this.updateViewMatrix();

            this.mProjectionViewMatrix.identity();
            this.mProjectionViewMatrix.mulMat4x4(this.mProjectionMatrix);
            this.mProjectionViewMatrix.mulMat4x4(this.mViewMatrix);
        }

        public setPosition(pos : Vector3) : void {
            this.mPosition = pos;
        }

        public getPosition() : Vector3 {
            return this.mPosition;
        }

        public resetPosition() : void {
            this.setPosition(new Vector3(0, 0, 0));
        }

        public setRotation(rotation : number) : void {
            this.mRotation = rotation;
        }

        public getRotation() : number {
            return this.mRotation;
        }

        public resetRotation() : void {
            this.setRotation(0);
        }

        public getProjectionMatrix() : Matrix4x4 {
            return this.mProjectionMatrix;
        }

        public getViewMatrix() : Matrix4x4 {
            return this.mViewMatrix;
        }

        public getProjectionViewMatrix() : Matrix4x4 {
            return this.mProjectionViewMatrix;
        }

        public setProjection(
            left : number,
            right : number,
            bottom : number,
            top : number,
            nearZ : number = -1,
            farZ : number = 1
        ) {
            this.mProjectionMatrix.identity();
            this.mProjectionMatrix.ortho(left, right, bottom, top, nearZ, farZ);
        }
    }
}
