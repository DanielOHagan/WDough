namespace WDOH {

    export class Time {

        private constructor() {}

        public static getCurrentTimeSeconds() : number {
            return performance.now() / 1_000;
        }

        public static getCurrentTimeMillis() : number {
            return performance.now();
        }

        public static convertMillisToSeconds(millis : number) : number {
            return millis / 1_000;
        }

        public static convertMillisToMinutes(millis : number) : number {
            return (millis / 1_000) / 60;
        }

        public static convertSecondsToMillis(seconds : number) : number {
            return seconds * 1_000;
        }

        public static convertSecondsToMinutes(seconds : number) : number {
            return seconds / 60;
        }

        public static convertMinutesToMillis(minutes : number) : number {
            return minutes * 60 * 1_000;
        }

        public static convertMinutesToSeconds(minutes : number) : number {
            return minutes * 60;
        }
    }
}
