namespace WDOH {
    
    export class ApplicationLoop {
        
        public static readonly DEFAULT_TARGET_FPS : number = 30;
        public static readonly DEFAULT_TARGET_BACKGROUND_FPS : number = 15;
        
        private mLastCycleTime : number;
        
        private mRunInBackground : boolean;
        private mFps : number;
        private mTargetFps : number;
        private mTargetBackgroundFps : number;
        private mFpsCounterTime : number;
        private mPreviousFps : number;
        private mTargetFrameTime : number;
        private mCurrentFrameTime : number;

        public constructor(targetFps : number) {
            this.mFps = 0;
            this.mTargetFps = targetFps;
            this.mTargetBackgroundFps = ApplicationLoop.DEFAULT_TARGET_BACKGROUND_FPS;
            this.mFpsCounterTime = 0;
            this.mPreviousFps = 0;
            this.mTargetFrameTime = 1 / targetFps;
            this.mRunInBackground = false;

            this.mCurrentFrameTime = 0;
            this.mLastCycleTime = Time.getCurrentTimeSeconds();
        }

        private mLastFrameExtraTime : number = 0;

        public run() : void {

            if (mApplication.isRunning()) {
                requestAnimationFrame(this.run.bind(this));
                
                //Update Delta Time
                let currentTime : number = Time.getCurrentTimeSeconds();
                let deltaTime = currentTime - this.mLastCycleTime;
                
                //If still in the time slot for previous frame
                // then don't call mApplication.update
                this.mCurrentFrameTime += deltaTime;
                let updateFrame : boolean;
                
                if (this.mCurrentFrameTime + this.mLastFrameExtraTime < this.mTargetFrameTime) {
                    updateFrame = false;
                } else {
                    this.mLastFrameExtraTime = this.mCurrentFrameTime + this.mLastFrameExtraTime - this.mTargetFrameTime;

                    this.mCurrentFrameTime = 0;
                    updateFrame = true;
                }

                //Update frame data each second
                this.mFpsCounterTime += deltaTime;
                if (this.mFpsCounterTime > 1) {
                    this.mPreviousFps = this.mFps;
                    this.mFps = 0;
                    this.mFpsCounterTime = 0;

                    //To display FPS every SECOND, call displayFps here
                    mApplication.displayFps(this.mPreviousFps);
                }
                
                if (updateFrame) {
                    updateFrame = mApplication.isFocused() || this.mRunInBackground;
                }

                if (updateFrame) {
                    this.mFps++;
                    mApplication.update(deltaTime);

                    //To display FPS every FRAME, call displayFps here
                    //mApplication.displayFps(this.mPreviousFps);
                }

                this.mLastCycleTime = currentTime;
            }
        }

        public onFocusChange(focused : boolean) : void {
            this.updateTargetFrameTime(focused)
        }

        private updateTargetFrameTime(focused : boolean) : void {
            if (focused) {
                this.mTargetFrameTime = 1 / this.mTargetFps;
            } else {
                this.mTargetFrameTime = 1 / this.mTargetBackgroundFps;
            }
        }

        //When changing mTargetFps USE THIS METHOD
        public setTargetFps(targetFps : number) : void {
            this.mTargetFps = targetFps;
            this.updateTargetFrameTime(mApplication.isFocused());
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