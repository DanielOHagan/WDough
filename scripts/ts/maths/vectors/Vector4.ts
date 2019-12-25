namespace wDOH {

    export class Vector4 {

        private mX : number;
        private mY : number;
        private mZ : number;
        private mW : number;

        public constructor(
            x : number = 0.0,
            y : number = 0.0,
            z : number = 0.0,
            w : number = 0.0
        ) {
            this.mX = x;
            this.mY = y;
            this.mZ = z;
            this.mW = w;
        }

        public get x() : number {
            return this.mX;
        }

        public set x(x : number) {
            this.mX = x;
        }

        public get y() : number {
            return this.mY;
        }

        public set y(y : number) {
            this.mY = y;
        }

        public get z() : number {
            return this.mZ;
        }

        public set z(z : number) {
            this.mZ = z;
        }

        public get w() : number {
            return this.mW;
        }

        public set w(w : number) {
            this.mW = w;
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

        public addVec4(vec : Vector4) : void {
            this.mX += vec.x;
            this.mY += vec.y;
            this.mZ += vec.z;
            this.mW += vec.w;
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

        public subtractVec4(vec : Vector4) : void {
            this.mX -= vec.x;
            this.mY -= vec.y;
            this.mZ -= vec.z;
            this.mW -= vec.w;
        }

        public cross() : void {
            //TODO:: This

        }

        public dot() : void {
            //TODO:: This
            
        }

        public mulMat4(mat : Matrix4x4) : void {
            this.x = (this.x * mat.m00Val) + (this.y * mat.m01Val) + (this.z * mat.m02Val) + (this.w * mat.m03Val);
            this.y = (this.x * mat.m10Val) + (this.y * mat.m11Val) + (this.z * mat.m12Val) + (this.w * mat.m13Val);
            this.z = (this.x * mat.m20Val) + (this.y * mat.m21Val) + (this.z * mat.m22Val) + (this.w * mat.m23Val);
            this.w = (this.x * mat.m30Val) + (this.y * mat.m31Val) + (this.z * mat.m32Val) + (this.w * mat.m33Val);
        }
    }
}