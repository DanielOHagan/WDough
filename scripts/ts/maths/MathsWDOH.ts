namespace WDOH {

    export class MathsWDOH {
        
        public static radToDeg(rad : number) : number {
            return rad * (180 / Math.PI);
        }

        public static degToRad(deg : number) : number {
            return deg * (Math.PI / 180);
        }
    }
}