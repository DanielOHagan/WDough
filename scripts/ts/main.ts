//Engine entry point

var mApplication : wDOH.Application;

window.onload = function () {
    mApplication = new wDOH.Application(new this.TestGame.TG_Logic());
    
    if (mApplication !== null) {
        mApplication.init();
        mApplication.run();
    }
}