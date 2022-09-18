namespace WDOH {

    export class MathsWDOH {

        /**
         * Convert radians into degrees.
         * 
         * @param rad Radian value to convert.
         * @returns The converted number of degrees.
         */
        public static radToDeg(rad : number) : number {
            return rad * (180 / Math.PI);
        }

        /**
         * Convert degrees into radians.
         * 
         * @param deg Degree value to convert.
         * @returns The converted number of radians.
         */
        public static degToRad(deg : number) : number {
            return deg * (Math.PI / 180);
        }

        /**
         * Clamp a number between a higher and lower bound.
         * 
         * @param value The number to be clamped.
         * @param lowerBound Lower bound for the range.
         * @param higherBound Higher bound for the range.
         * @returns Value in the range between the lower and higher bounds.
         * @throws Error if the lower bound is greater than the higher bound.
         */
        public static clamp(value : number, lowerBound : number, higherBound : number) : number {
            if (lowerBound > higherBound) {
                throw new Error(`Lower : ${lowerBound} > Higher : ${higherBound}`);
            }

            return value > higherBound ? higherBound : value < lowerBound ? lowerBound : value;
        }

        /**
         * Clamp a number to a lower bound.
         * 
         * @param value The number to be clamped.
         * @param lowerBound Lower bound for the range.
         * @returns Value if value is greater than the lower bound, else return lowerBound.
         */
        public static clampLow(value : number, lowerBound : number) : number {
            return value < lowerBound ? lowerBound : value;
        }

        /**
         * Clamp a number to a higher bound.
         * 
         * @param value The number to be clamped.
         * @param higherBound Higher bound for the range.
         * @returns Value if value is lower than the higher bound, else return higherBound.
         */
        public static clampHigh(value : number, higherBound : number) : number {
            return value > higherBound ? higherBound : value;
        }

        /**
         * Generate a random number in the range between the two bounds given.
         * 
         * @param min The lower bound for the random number.
         * @param max The higher bound for the randome number.
         * @returns A random number between the bounds given.
         */
        public static randNum(min : number, max : number) : number {
            if (min > max) {
                throw new Error(`Min : ${min} is greater than Max : ${max}`);
            }

            return (Math.random() * (max - min)) + min;
        }

        //Just a convenience function, it is faster to call specific transformations on a matrix instance when needed
        public static generateTransformationMat4(
            translation : Vector3,
            scale : Vector3,
            rotationDegrees : number,
            rotationAxes : Vector3
        ) : Matrix4x4 {
            let transformationMatrix : Matrix4x4 = new Matrix4x4();

            transformationMatrix.translateVec3(translation);
            transformationMatrix.rotateRads(MathsWDOH.degToRad(rotationDegrees), rotationAxes);
            transformationMatrix.scaleXYZ(scale.x, scale.y, scale.z);

            return transformationMatrix;
        }
    }
}
