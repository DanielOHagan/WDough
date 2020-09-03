namespace WDOH {

    export class Vector4 implements IVector<Vector4> {

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

        public addVec2(vec : Vector2) : Vector4 {
            this.mX += vec.x;
            this.mY += vec.y;

            return this;
        }

        public addVec3(vec : Vector3) : Vector4 {
            this.mX += vec.x;
            this.mY += vec.y;
            this.mZ += vec.z;

            return this;
        }

        public addVec4(vec : Vector4) : Vector4 {
            this.mX += vec.x;
            this.mY += vec.y;
            this.mZ += vec.z;
            this.mW += vec.w;

            return this;
        }

        public subtractVec2(vec : Vector2) : Vector4 {
            this.mX -= vec.x;
            this.mY -= vec.y;

            return this;
        }

        public subtractVec3(vec : Vector3) : Vector4 {
            this.mX -= vec.x;
            this.mY -= vec.y;
            this.mZ -= vec.z;

            return this;
        }

        public subtractVec4(vec : Vector4) : Vector4 {
            this.mX -= vec.x;
            this.mY -= vec.y;
            this.mZ -= vec.z;
            this.mW -= vec.w;

            return this;
        }

        public mult(multiplier : number) : Vector4 {
            this.mX *= multiplier;
            this.mY *= multiplier;
            this.mZ *= multiplier;
            this.mW *= multiplier;

            return this;
        }

        public divide(div : number) : Vector4 {
            this.mX /= div;
            this.mY /= div;
            this.mZ /= div;
            this.mW /= div;

            return this;
        }

        public cross() : Vector4 {
            //TODO:: This

            return this;
        }

        public dot() : Vector4 {
            //TODO:: This
            
            
            return this;
        }

        public mulMat4(mat : Matrix4x4) : Vector4 {
            this.x = (this.x * mat.m00Val) + (this.y * mat.m01Val) + (this.z * mat.m02Val) + (this.w * mat.m03Val);
            this.y = (this.x * mat.m10Val) + (this.y * mat.m11Val) + (this.z * mat.m12Val) + (this.w * mat.m13Val);
            this.z = (this.x * mat.m20Val) + (this.y * mat.m21Val) + (this.z * mat.m22Val) + (this.w * mat.m23Val);
            this.w = (this.x * mat.m30Val) + (this.y * mat.m31Val) + (this.z * mat.m32Val) + (this.w * mat.m33Val);

            return this;
        }
    }
}