namespace WDOH {

    export class Matrix4x4 implements IMatrix<Matrix4x4> {

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

        public identity() : Matrix4x4 {
            this.m00 = this.m11 = this.m22 = this.m33 = 1;

            this.m01 = this.m02 = this.m03 =
            this.m10 = this.m12 = this.m13 =
            this.m20 = this.m21 = this.m23 =
            this.m30 = this.m31 = this.m32 = 0;

            return this;
        }

        public mulNum(num : number) : Matrix4x4 {
            this.m00 *= num;
            this.m01 *= num;
            this.m02 *= num;
            this.m03 *= num;
            this.m10 *= num;
            this.m11 *= num;
            this.m12 *= num;
            this.m13 *= num;
            this.m20 *= num;
            this.m21 *= num;
            this.m22 *= num;
            this.m23 *= num;
            this.m30 *= num;
            this.m31 *= num;
            this.m32 *= num;
            this.m33 *= num;

            return this;
        }

        public mulMat4x4(mat : Matrix4x4) : Matrix4x4 {
            let temp : Matrix4x4 = new Matrix4x4();

            temp.m00 = (mat.m00 * this.m00) + (mat.m01 * this.m10) + (mat.m02 * this.m20) + (mat.m03 * this.m30);
            temp.m01 = (mat.m00 * this.m01) + (mat.m01 * this.m11) + (mat.m02 * this.m21) + (mat.m03 * this.m31);
            temp.m02 = (mat.m00 * this.m02) + (mat.m01 * this.m12) + (mat.m02 * this.m22) + (mat.m03 * this.m32);
            temp.m03 = (mat.m00 * this.m03) + (mat.m01 * this.m13) + (mat.m02 * this.m23) + (mat.m03 * this.m33);

            temp.m10 = (mat.m10 * this.m00) + (mat.m11 * this.m10) + (mat.m12 * this.m20) + (mat.m13 * this.m30);
            temp.m11 = (mat.m10 * this.m01) + (mat.m11 * this.m11) + (mat.m12 * this.m21) + (mat.m13 * this.m31);
            temp.m12 = (mat.m10 * this.m02) + (mat.m11 * this.m12) + (mat.m12 * this.m22) + (mat.m13 * this.m32);
            temp.m13 = (mat.m10 * this.m03) + (mat.m11 * this.m13) + (mat.m12 * this.m23) + (mat.m13 * this.m33);

            temp.m20 = (mat.m20 * this.m00) + (mat.m21 * this.m10) + (mat.m22 * this.m20) + (mat.m23 * this.m30);
            temp.m21 = (mat.m20 * this.m01) + (mat.m21 * this.m11) + (mat.m22 * this.m21) + (mat.m23 * this.m31);
            temp.m22 = (mat.m20 * this.m02) + (mat.m21 * this.m12) + (mat.m22 * this.m22) + (mat.m23 * this.m32);
            temp.m23 = (mat.m20 * this.m03) + (mat.m21 * this.m13) + (mat.m22 * this.m23) + (mat.m23 * this.m33);

            temp.m30 = (mat.m30 * this.m00) + (mat.m31 * this.m10) + (mat.m32 * this.m20) + (mat.m33 * this.m30);
            temp.m31 = (mat.m30 * this.m01) + (mat.m31 * this.m11) + (mat.m32 * this.m21) + (mat.m33 * this.m31);
            temp.m32 = (mat.m30 * this.m02) + (mat.m31 * this.m12) + (mat.m32 * this.m22) + (mat.m33 * this.m32);
            temp.m33 = (mat.m30 * this.m03) + (mat.m31 * this.m13) + (mat.m32 * this.m23) + (mat.m33 * this.m33);

            this.set(temp);

            return this;
        }

        public ortho(
            left : number,
            right : number,
            bottom : number,
            top : number,
            nearZ : number,
            farZ : number
        ) : Matrix4x4 {
            this.m00 = 2 / (right - left);
            this.m11 = 2 / (top - bottom);
            this.m22 = -2 / (farZ - nearZ);

            this.m30 = (right + left) / (right - left);
            this.m31 = (top + bottom) / (top - bottom);
            this.m32 = (farZ + nearZ) / (farZ - nearZ);
            this.m33 = 1;

            return this;
        }

        public translateVec2(vec : Vector2) : Matrix4x4 {
            this.m30 = vec.x;
            this.m31 = vec.y;

            return this;
        }

        public translateVec3(vec : Vector3) : Matrix4x4 {
            this.m30 = vec.x;
            this.m31 = vec.y;
            this.m32 = vec.z;

            return this;
        }


        public invert() : Matrix4x4 {
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

            return this;
        }

        public rotateRads(angleRads : number, axis : Vector3) : Matrix4x4 {
            let sin = Math.sin(angleRads);
            let cos = Math.cos(angleRads);
            let C = 1 - cos;
            let xx = axis.x * axis.x;
            let xy = axis.x * axis.y;
            let xz = axis.x * axis.z;
            let yy = axis.y * axis.y;
            let yz = axis.y * axis.z;
            let zz = axis.z * axis.z;
            let rm00 = xx * C + cos;
            let rm01 = xy * C + axis.z * sin;
            let rm02 = xz * C - axis.y * sin;
            let rm10 = xy * C - axis.z * sin;
            let rm11 = yy * C + cos;
            let rm12 = yz * C + axis.x * sin;
            let rm20 = xz * C + axis.y * sin;
            let rm21 = yz * C - axis.x * sin;
            let rm22 = zz * C + cos;
            let nm00 = (this.m00 * rm00) + (this.m10 * rm01) + (this.m20 * rm02);
            let nm01 = (this.m01 * rm00) + (this.m11 * rm01) + (this.m21 * rm02);
            let nm02 = (this.m02 * rm00) + (this.m12 * rm01) + (this.m22 * rm02);
            let nm03 = (this.m03 * rm00) + (this.m13 * rm01) + (this.m23 * rm02);
            let nm10 = (this.m00 * rm10) + (this.m10 * rm11) + (this.m20 * rm12);
            let nm11 = (this.m01 * rm10) + (this.m11 * rm11) + (this.m21 * rm12);
            let nm12 = (this.m02 * rm10) + (this.m12 * rm11) + (this.m22 * rm12);
            let nm13 = (this.m03 * rm10) + (this.m13 * rm11) + (this.m23 * rm12);

            let temp : Matrix4x4 = new Matrix4x4();
            temp.m00 = nm00;
            temp.m01 = nm01;
            temp.m02 = nm02;
            temp.m03 = nm03;
            temp.m10 = nm10;
            temp.m11 = nm11;
            temp.m12 = nm12;
            temp.m13 = nm13;
            temp.m20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22;
            temp.m21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22;
            temp.m22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22;
            temp.m23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22;
            temp.m30 = this.m30;
            temp.m31 = this.m31;
            temp.m32 = this.m32;
            temp.m33 = this.m33;

            this.set(temp);

            return this;
        }
        
        public scaleScalar(scale : number) : Matrix4x4 {
            this.scaleXYZ(scale, scale, scale);

            return this;
        }

        public scaleXYZ(x : number, y : number, z : number) : Matrix4x4 {
            this.m00 *= x;
            this.m01 *= x;
            this.m02 *= x;
            this.m03 *= x;

            this.m10 *= y;
            this.m11 *= y;
            this.m12 *= y;
            this.m13 *= y;

            this.m20 *= z;
            this.m21 *= z;
            this.m22 *= z;
            this.m23 *= z;

            return this;
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
            return this.m00.valueOf();
        }

        public get m01Val() : number {
            return this.m01.valueOf();
        }

        public get m02Val() : number {
            return this.m02.valueOf();
        }

        public get m03Val() : number {
            return this.m03.valueOf();
        }

        public get m10Val() : number {
            return this.m10.valueOf();
        }

        public get m11Val() : number {
            return this.m11.valueOf();
        }

        public get m12Val() : number {
            return this.m12.valueOf();
        }

        public get m13Val() : number {
            return this.m13.valueOf();
        }

        public get m20Val() : number {
            return this.m20.valueOf();
        }

        public get m21Val() : number {
            return this.m21.valueOf();
        }

        public get m22Val() : number {
            return this.m22.valueOf();
        }

        public get m23Val() : number {
            return this.m23.valueOf();
        }

        public get m30Val() : number {
            return this.m30.valueOf();
        }

        public get m31Val() : number {
            return this.m31.valueOf();
        }

        public get m32Val() : number {
            return this.m32.valueOf();
        }

        public get m33Val() : number {
            return this.m33.valueOf();
        }
    }
}