namespace WDOH {

    export class Time {
        
        private constructor() {}

        public static getCurrentTimeSeconds() : number {
            return performance.now() / 1_000;
        }

        public static getCurrentTimeMillis() : number {
            return performance.now();
        }
    }
}