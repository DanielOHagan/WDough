namespace wDOH {

    export class Matrix4x4 {

        /*
            m00  m01  m02  m03
            m10  m11  m12  m13
            m20  m21  m22  m23
            m30  m31  m32  m33
        */
        
        private m00 : number;
        private m01 : number;
        private m02 : number;
        private m03 : number;
        private m10 : number;
        private m11 : number;
        private m12 : number;
        private m13 : number;
        private m20 : number;
        private m21 : number;
        private m22 : number;
        private m23 : number;
        private m30 : number;
        private m31 : number;
        private m32 : number;
        private m33 : number;

        public constructor() {
            //Default to identity
            this.m00 = this.m11 = this.m22 = this.m33 = 1;

            this.m01 = this.m02 = this.m03 =
            this.m10 = this.m12 = this.m13 =
            this.m20 = this.m21 = this.m23 =
            this.m30 = this.m31 = this.m32 = 0;
        }

        public identity() : void {
            this.m00 = this.m11 = this.m22 = this.m33 = 1;

            this.m01 = this.m02 = this.m03 =
            this.m10 = this.m12 = this.m13 =
            this.m20 = this.m21 = this.m23 =
            this.m30 = this.m31 = this.m32 = 0;
        }

        public mulNum(num : number) :void {
            //TODO:: This
        }

        public mulMat4x4(mat : Matrix4x4) : void {
            let dest : Matrix4x4 = new Matrix4x4();

            dest.m00 = (this.m00 * mat.m00) + (this.m01 * mat.m10) + (this.m02 * mat.m20) + (this.m03 * mat.m30);
            dest.m01 = (this.m00 * mat.m01) + (this.m01 * mat.m11) + (this.m02 * mat.m21) + (this.m03 * mat.m31);
            dest.m02 = (this.m00 * mat.m02) + (this.m01 * mat.m12) + (this.m02 * mat.m22) + (this.m03 * mat.m32);
            dest.m03 = (this.m00 * mat.m03) + (this.m01 * mat.m13) + (this.m02 * mat.m23) + (this.m03 * mat.m33);

            dest.m10 = (this.m10 * mat.m00) + (this.m11 * mat.m10) + (this.m12 * mat.m20) + (this.m13 * mat.m30);
            dest.m11 = (this.m10 * mat.m01) + (this.m11 * mat.m11) + (this.m12 * mat.m21) + (this.m13 * mat.m31);
            dest.m12 = (this.m10 * mat.m02) + (this.m11 * mat.m12) + (this.m12 * mat.m22) + (this.m13 * mat.m32);
            dest.m13 = (this.m10 * mat.m03) + (this.m11 * mat.m13) + (this.m12 * mat.m23) + (this.m13 * mat.m33);

            dest.m20 = (this.m20 * mat.m00) + (this.m21 * mat.m10) + (this.m22 * mat.m20) + (this.m23 * mat.m30);
            dest.m21 = (this.m20 * mat.m01) + (this.m21 * mat.m11) + (this.m22 * mat.m21) + (this.m23 * mat.m31);
            dest.m22 = (this.m20 * mat.m02) + (this.m21 * mat.m12) + (this.m22 * mat.m22) + (this.m23 * mat.m32);
            dest.m23 = (this.m20 * mat.m03) + (this.m21 * mat.m13) + (this.m22 * mat.m23) + (this.m23 * mat.m33);

            dest.m30 = (this.m30 * mat.m00) + (this.m31 * mat.m10) + (this.m32 * mat.m20) + (this.m33 * mat.m30);
            dest.m31 = (this.m30 * mat.m01) + (this.m31 * mat.m11) + (this.m32 * mat.m21) + (this.m33 * mat.m31);
            dest.m32 = (this.m30 * mat.m02) + (this.m31 * mat.m12) + (this.m32 * mat.m22) + (this.m33 * mat.m32);
            dest.m33 = (this.m30 * mat.m03) + (this.m31 * mat.m13) + (this.m32 * mat.m23) + (this.m33 * mat.m33);
            
            this.set(dest);
        }

        public ortho(
            left : number,
            right : number,
            bottom : number,
            top : number,
            nearZ : number,
            farZ : number
        ) : void {
            this.m00 = 2 / (right - left);
            this.m11 = 2 / (top - bottom);
            this.m22 = -2 / (farZ - nearZ);

            this.m30 = (right + left) / (right - left);
            this.m31 = (top + bottom) / (top - bottom);
            this.m32 = (farZ + nearZ) / (farZ - nearZ);
            this.m33 = 1;
        }

        public translateVec2(vec : Vector2) : void {
            this.m30 = (this.m00 * vec.x) + (this.m10 * vec.y) + this.m20 + this.m30;
            this.m31 = (this.m01 * vec.x) + (this.m11 * vec.y) + this.m21 + this.m31;
            this.m32 = (this.m02 * vec.x) + (this.m12 * vec.y) + this.m22 + this.m32;
            this.m33 = (this.m03 * vec.x) + (this.m13 * vec.y) + this.m23 + this.m33;
        }

        public translateVec3(vec : Vector3) : void {
            this.m30 = (this.m00 * vec.x) + (this.m10 * vec.y) + (this.m20 * vec.z) + this.m30;
            this.m31 = (this.m01 * vec.x) + (this.m11 * vec.y) + (this.m21 * vec.z) + this.m31;
            this.m32 = (this.m02 * vec.x) + (this.m12 * vec.y) + (this.m22 * vec.z) + this.m32;
            this.m33 = (this.m03 * vec.x) + (this.m13 * vec.y) + (this.m23 * vec.z) + this.m33;
        }

        public translateVec4(vec : Vector4) : void {
            this.m30 = (this.m00 * vec.x) + (this.m10 * vec.y) + (this.m20 * vec.z) + (this.m30 * vec.w);
            this.m31 = (this.m01 * vec.x) + (this.m11 * vec.y) + (this.m21 * vec.z) + (this.m31 * vec.w);
            this.m32 = (this.m02 * vec.x) + (this.m12 * vec.y) + (this.m22 * vec.z) + (this.m32 * vec.w);
            this.m33 = (this.m03 * vec.x) + (this.m13 * vec.y) + (this.m23 * vec.z) + (this.m33 * vec.w);
        }

        public invert() : void {
            let mat : Matrix4x4 = new Matrix4x4();

            //Determinant calculation
            let a : number = (this.m00 * this.m11) - (this.m01 * this.m10);
            let b : number = (this.m00 * this.m12) - (this.m02 * this.m10);
            let c : number = (this.m00 * this.m13) - (this.m03 * this.m10);
            let d : number = (this.m01 * this.m12) - (this.m02 * this.m11);
            let e : number = (this.m01 * this.m13) - (this.m03 * this.m11);
            let f : number = (this.m02 * this.m13) - (this.m03 * this.m12);
            let g : number = (this.m20 * this.m31) - (this.m21 * this.m30);
            let h : number = (this.m20 * this.m32) - (this.m22 * this.m30);
            let i : number = (this.m20 * this.m33) - (this.m23 * this.m30);
            let j : number = (this.m21 * this.m32) - (this.m22 * this.m31);
            let k : number = (this.m21 * this.m33) - (this.m23 * this.m31);
            let l : number = (this.m22 * this.m33) - (this.m23 * this.m32);
            let determinant : number = 1 / ((a * l) - (b * k) + (c * j) + (d * i) - (e * h) + (f * g));

            mat.m00 = ((this.m11 * l) - (this.m12 * k) + (this.m13 * j)) * determinant;
            mat.m01 = ((-this.m01 * l) + (this.m02 * k) - (this.m03 * j)) * determinant;
            mat.m02 = ((this.m31 * f) - (this.m32 * e) + (this.m33 * d)) * determinant;
            mat.m03 = ((-this.m21 * f) + (this.m22 * e) - (this.m23 * d)) * determinant;

            mat.m10 = ((-this.m10 * l) + (this.m12 * i) - (this.m13 * h)) * determinant;
            mat.m11 = ((this.m00 * l) - (this.m02 * i) + (this.m03 * h)) * determinant;
            mat.m12 = ((-this.m30 * f) + (this.m32 * c) - (this.m33 * b)) * determinant;
            mat.m13 = ((this.m20 * f) - (this.m22 * c) + (this.m23 * b)) * determinant;

            mat.m20 = ((this.m10 * k) - (this.m11 * i) + (this.m13 * g)) * determinant;
            mat.m21 = ((-this.m00 * k) + (this.m01 * i) - (this.m03 * g)) * determinant;
            mat.m22 = ((this.m30 * e) - (this.m31 * c) + (this.m33 * a)) * determinant;
            mat.m23 = ((-this.m20 * e) + (this.m21 * c) - (this.m23 * a)) * determinant;

            mat.m30 = ((-this.m10 * j) + (this.m11 * h) - (this.m12 * g)) * determinant;
            mat.m31 = ((this.m00 * j) - (this.m01 * h) + (this.m02 * g)) * determinant;
            mat.m32 = ((-this.m30 * d) + (this.m31 * b) - (this.m32 * a)) * determinant;
            mat.m33 = ((this.m20 * d) - (this.m21 * b) + (this.m22 * a)) * determinant;

            this.set(mat);
        }

        public asArray() : number[] {
            return [
                this.m00, this.m01, this.m02, this.m03,
                this.m10, this.m11, this.m12, this.m13,
                this.m20, this.m21, this.m22, this.m23,
                this.m30, this.m31, this.m32, this.m33,
            ];
        }

        public set(mat : Matrix4x4) : void {
            this.m00 = mat.m00;
            this.m01 = mat.m01;
            this.m02 = mat.m02;
            this.m03 = mat.m03;
            this.m10 = mat.m10;
            this.m11 = mat.m11;
            this.m12 = mat.m12;
            this.m13 = mat.m13;
            this.m20 = mat.m20;
            this.m21 = mat.m21;
            this.m22 = mat.m22;
            this.m23 = mat.m23;
            this.m30 = mat.m30;
            this.m31 = mat.m31;
            this.m32 = mat.m32;
            this.m33 = mat.m33;
        }
        
        public printToConsole() : void {
            console.log(`------------------------------------------------------`);
            console.log(`| ${this.m00} | ${this.m01} | ${this.m02} | ${this.m03} |`);
            console.log(`| ${this.m10} | ${this.m11} | ${this.m12} | ${this.m13} |`);
            console.log(`| ${this.m20} | ${this.m21} | ${this.m22} | ${this.m23} |`);
            console.log(`| ${this.m30} | ${this.m31} | ${this.m32} | ${this.m33} |`);
            console.log(`------------------------------------------------------`);
        }

        //Getters 
        public get m00Val() : number {
            return this.m00;
        }

        public get m01Val() : number {
            return this.m01;
        }

        public get m02Val() : number {
            return this.m02;
        }

        public get m03Val() : number {
            return this.m03;
        }

        public get m10Val() : number {
            return this.m10;
        }

        public get m11Val() : number {
            return this.m11;
        }

        public get m12Val() : number {
            return this.m12;
        }

        public get m13Val() : number {
            return this.m13;
        }

        public get m20Val() : number {
            return this.m20;
        }

        public get m21Val() : number {
            return this.m21;
        }

        public get m22Val() : number {
            return this.m22;
        }

        public get m23Val() : number {
            return this.m23;
        }

        public get m30Val() : number {
            return this.m30;
        }

        public get m31Val() : number {
            return this.m31;
        }

        public get m32Val() : number {
            return this.m32;
        }

        public get m33Val() : number {
            return this.m33;
        }
    }
}