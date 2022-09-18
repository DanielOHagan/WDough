namespace WDOH {

    export class ApplicationLoop {

        public static readonly DEFAULT_TARGET_FPS : number = 60;
        public static readonly DEFAULT_TARGET_BACKGROUND_FPS : number = 15;
        public static readonly DEFAULT_RUN_IN_BACKGROUND : boolean = true;

        private mRunInBackground : boolean;
        private mFps : number;
        private mTargetFps : number;
        private mTargetBackgroundFps : number;
        private mFpsCounterTime : number;
        private mPreviousFps : number;
        private mTargetFrameTimeSpan : number;
        private mCurrentFrameTimeSpan : number;
        private mLastFrameExtraTimeSpan : number;
        private mLastCycleTimePoint : number;

        public constructor(targetFps : number) {
            this.mTargetBackgroundFps = ApplicationLoop.DEFAULT_TARGET_BACKGROUND_FPS;
            this.mRunInBackground = ApplicationLoop.DEFAULT_RUN_IN_BACKGROUND;
            this.mTargetFps = targetFps <= 0 ? ApplicationLoop.DEFAULT_TARGET_FPS : targetFps;
            this.mFps = 0;
            this.mFpsCounterTime = 0;
            this.mPreviousFps = 0;
            this.mTargetFrameTimeSpan = 1 / targetFps;
            this.mCurrentFrameTimeSpan = 0;
            this.mLastFrameExtraTimeSpan = 0;
            this.mLastCycleTimePoint = Time.getCurrentTimeSeconds();
        }

        public run() : void {
            if (mApplication.isRunning()) {
                requestAnimationFrame(this.run.bind(this));

                //Update Delta Time
                let currentTimePoint : number = Time.getCurrentTimeSeconds();
                let deltaTimeSpan = currentTimePoint - this.mLastCycleTimePoint;

                //If still in the time slot for previous frame
                // then don't call mApplication.update
                this.mCurrentFrameTimeSpan += deltaTimeSpan;
                let updateFrame : boolean;

                if (this.mCurrentFrameTimeSpan + this.mLastFrameExtraTimeSpan < this.mTargetFrameTimeSpan) {
                    updateFrame = false;
                } else {
                    this.mLastFrameExtraTimeSpan = this.mCurrentFrameTimeSpan + this.mLastFrameExtraTimeSpan - this.mTargetFrameTimeSpan;
                    updateFrame = true;
                }

                //Update frame data each second
                this.mFpsCounterTime += deltaTimeSpan;
                if (this.mFpsCounterTime > 1) {
                    this.mPreviousFps = this.mFps;
                    this.mFps = 0;
                    this.mFpsCounterTime = 0;
                    this.mLastFrameExtraTimeSpan = 0;

                    //Display FPS every second
                    //let category : DebugOutputCategory | null = _DebugOutput().getCategoryByName("General");
                    //if (category !== null) {
                    //    category.updateValue("FPS", this.mPreviousFps.toString());
                    //} else {
                    //    _Logger().errWDOH("General category not found");
                    //}
                }

                // updateFrame = updateFrame && (mApplication.isFocused() || this.mRunInBackground);
                if (updateFrame) {
                    updateFrame = mApplication.isFocused() || this.mRunInBackground;
                }

                if (updateFrame) {
                    this.mFps++;
                    mApplication.update(this.mCurrentFrameTimeSpan);
                    this.mCurrentFrameTimeSpan = 0;
                }

                this.mLastCycleTimePoint = currentTimePoint;
            } else {
                mApplication.end();
            }
        }

        public onFocusChange(focused : boolean) : void {
            this.updateTargetFrameTime(focused);
        }

        private updateTargetFrameTime(focused : boolean) : void {
            if (focused) {
                this.mTargetFrameTimeSpan = 1 / this.mTargetFps;
            } else if (!this.mRunInBackground) {
                this.mTargetFrameTimeSpan = 1 / this.mTargetBackgroundFps;
            }
        }

        public setTargetFps(targetFps : number, includeTargetBackground : boolean) : void {
            this.mTargetFps = targetFps;

            if (includeTargetBackground) {
                this.mTargetBackgroundFps = targetFps;
            }

            this.updateTargetFrameTime(mApplication.isFocused());
            //_DebugOutput().getCategoryByName("General")?.updateValue("Target FPS", this.mTargetFps.toString());
        }

        public setTargetBackgroundFps(targetBackgroundFps : number) : void {
            this.mTargetBackgroundFps = targetBackgroundFps;
            this.updateTargetFrameTime(mApplication.isFocused());
        }

        public getTargetFps() : number {
            return this.mTargetFps;
        }

        public getFps() : number {
            //Return the last full second's FPS count
            return this.mPreviousFps;
        }

        public shouldRunInBackground() : boolean {
            return this.mRunInBackground;
        }

        public setRunInBackground(run : boolean) : void {
            this.mRunInBackground = run;
        }
    }
}
