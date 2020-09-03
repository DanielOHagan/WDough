namespace WDOH {

    export class Vector3 implements IVector<Vector3> {

        private mX : number;
        private mY : number;
        private mZ : number;

        public constructor(x : number, y : number, z : number) {
            this.mX = x;
            this.mY = y;
            this.mZ = z;
        }

        public get x() {
            return this.mX;
        }

        public set x(x : number) {
            this.mX = x;
        }

        public get y() {
            return this.mY;
        }

        public set y(y : number) {
            this.mY = y;
        }

        public get z() {
            return this.mZ;
        }

        public set z(z : number) {
            this.mZ = z;
        }

        public addVec2(vec : Vector2) : Vector3 {
            this.mX += vec.x;
            this.mY += vec.y;

            return this;
        }

        public addVec3(vec : Vector3) : Vector3 {
            this.mX += vec.x;
            this.mY += vec.y;
            this.mZ += vec.z;

            return this;
        }

        public subtractVec2(vec : Vector2) : Vector3 {
            this.mX -= vec.x;
            this.mY -= vec.y;

            return this;
        }

        public subtractVec3(vec : Vector3) : Vector3 {
            this.mX -= vec.x;
            this.mY -= vec.y;
            this.mZ -= vec.z;

            return this;
        }

        public mult(scalar : number) : Vector3 {
            this.mX *= scalar;
            this.mY *= scalar;
            this.mZ *= scalar;

            return this;
        }

        public divide(div : number) : Vector3 {
            this.mX /= div;
            this.mY /= div;
            this.mZ /= div;

            return this;
        }

        public cross() : Vector3 {
            //TODO:: This

            return this;
        }

        public dot() : Vector3 {
            //TODO:: This
            
            return this;
        }
    }
}