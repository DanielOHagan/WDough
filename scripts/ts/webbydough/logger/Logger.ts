namespace WDOH {
    export class Logger {

        private static readonly WDOH_LOG_PREFIX : string = "WDOH: ";
        private static readonly APP_DEFUALT_LOG_PREFIX : string = "APP: ";

        private readonly mAppPrefix : string;

        public constructor(appName : string | null) {
            this.mAppPrefix = appName !== null ? appName + ": " : Logger.APP_DEFUALT_LOG_PREFIX;
        }

        //Engine
        public infoWDOH(message : string) : void {
            console.log((Logger.WDOH_LOG_PREFIX + message).trim());
        }

        public warnWDOH(message : string) : void {
            console.warn((Logger.WDOH_LOG_PREFIX + message).trim());
        }

        public errWDOH(message : string) : void {
            console.error((Logger.WDOH_LOG_PREFIX + message).trim());
        }


        //Application
        public infoApp(message : string) : void {
            console.log((this.mAppPrefix + message).trim());
        }

        public warnApp(message : string) : void {
            console.warn((this.mAppPrefix + message).trim());
        }

        public errApp(message : string) : void {
            console.error((this.mAppPrefix + message).trim());
        }
    }
}
