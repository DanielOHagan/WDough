namespace WDOH {

    export abstract class AGeometry2D implements ISceneNode {

        public mPosition : Vector3;
        public mSize : Vector2;
        public mRotation : number; //Rotation in Radians

        /**
         * 
         * @param pos 
         * @param size 
         * @param rotation 
         */
        protected constructor(pos : Vector3, size : Vector2, rotation : number) {
            this.mPosition = pos;
            this.mSize = size;
            this.mRotation = rotation;
        }

        public getGeometry() : AGeometry2D {
            return this;
        }

        // public rotateDegrees(degs : number) : void {
        //     this.mRotation += MathsWDOH.degToRad(degs);
        // }

        // public rotateRadians(rads : number) : void {
        //     this.mRotation += rads;
        // }

        public setRotationDegrees(degs : number) : void {
            this.mRotation = MathsWDOH.degToRad(degs);
        }

        public setRotationRadians(rads : number) : void {
            this.mRotation = rads;
        }

        public getPosition() : Vector3 {
            return this.mPosition;
        }

        public getSize() : Vector2 {
            return this.mSize;
        }

        public getRotationDegrees() : number {
            return MathsWDOH.radToDeg(this.mRotation);
        }

        public getRotationRadians() : number {
            return this.mRotation;
        }
    }
}
