namespace WDOH {

    export class Vector3 {

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

        public addVec2(vec : Vector2) : void {
            this.mX += vec.x;
            this.mY += vec.y;
        }

        public addVec3(vec : Vector3) : void {
            this.mX += vec.x;
            this.mY += vec.y;
            this.mZ += vec.z;
        }

        public subtractVec2(vec : Vector2) : void {
            this.mX -= vec.x;
            this.mY -= vec.y;
        }

        public subtractVec3(vec : Vector3) : void {
            this.mX -= vec.x;
            this.mY -= vec.y;
            this.mZ -= vec.z;
        }

        public cross() : void {
            //TODO:: This

        }

        public dot() : void {
            //TODO:: This
            
        }
    }
}