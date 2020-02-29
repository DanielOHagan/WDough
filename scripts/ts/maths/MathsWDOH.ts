namespace WDOH {

    export class MathsWDOH {
        
        public static radToDeg(rad : number) : number {
            return rad * (180 / Math.PI);
        }

        public static degToRad(deg : number) : number {
            return deg * (Math.PI / 180);
        }

        //Just a convenience function, it is faster to call specific transformations on a matrix instance when needed
        public static generateTransformationMat4(translation : Vector3, scale : Vector3, rotationDegrees : number, rotationAxes : Vector3) : Matrix4x4 {
            let transformationMatrix : Matrix4x4 = new Matrix4x4();

            transformationMatrix.translateVec3(translation);
            transformationMatrix.rotateRads(MathsWDOH.degToRad(rotationDegrees), rotationAxes);
            transformationMatrix.scaleXYZ(scale.x, scale.y, scale.z);

            return transformationMatrix;
        }
    }
}