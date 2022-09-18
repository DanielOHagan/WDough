namespace WDOH {

    export class Timer {

        protected mName : string;
        protected mTicking : boolean;
        protected mStartTimeMillis : number;
        protected mEndTimeMillis : number;

        public constructor(name : string, startTicking : boolean) {
            this.mName = name;
            this.mTicking = startTicking;
            this.mStartTimeMillis = startTicking ? Time.getCurrentTimeMillis() : -1;
            this.mEndTimeMillis = -1;
        }

        /**
         * Start the clock ticking if not already and record the start time.
         * If the clock has already recorded a start & end time, both are overwritten at the start.
         */
        public start() : void {
            if (this.mTicking) {
                _Logger().warnWDOH(`Timer: ${this.mName} is already ticking.`);
            } else {
                this.mTicking = true;
                this.mStartTimeMillis = Time.getCurrentTimeMillis();
                this.mEndTimeMillis = -1;
            }
        }

        /**
         * Stop the clock ticking if not already and record the end time.
         */
        public stop() : void {
            if (this.mTicking) {
                this.mTicking = false;
                this.mEndTimeMillis = Time.getCurrentTimeMillis();
            } else {
                _Logger().warnWDOH(`Timer: ${this.mName} is not ticking.`);
            }
        }

        /**
         * @returns Name of this Timer instance.
         */
        public getName() : string {
            return this.mName;
        }

        /**
         * @returns The current ticking (a.k.a running) state of the this Timer instance.
         */
        public isTicking() : boolean {
            return this.mTicking;
        }

        /**
         * @returns The time this Timer instance started ticking in Milliseconds if the clock has started ticking.
         */
        public getStartTimeMillis() : number {
            if (this.mStartTimeMillis === -1) {
                _Logger().warnWDOH(`Timer: ${this.mName} has not started ticking.`);
            }

            return this.mStartTimeMillis;
        }


        /**
         * @returns The time this Timer instance ended ticking in Milliscends if the clock has stopped ticking.
         */
        public getEndTimeMillis() : number {
            if (this.mEndTimeMillis === -1) {
                _Logger().warnWDOH(`Timer: ${this.mName} has not ended ticking.`);
            }

            return this.mEndTimeMillis;
        }

        /**
         * @returns The total time this Timer instance spent ticking if this Timer has started.
         *  If the clock as started but not stopped then the returned time is the time from start till this function call.
         *  Else it is the time from start ticking till end ticking.
         */
        public getTotalTickingTime() : number {
            if (this.mTicking) {
                return Time.getCurrentTimeMillis() - this.mStartTimeMillis;
            } else {
                return this.mEndTimeMillis - this.mStartTimeMillis;
            }
        }
    }
}