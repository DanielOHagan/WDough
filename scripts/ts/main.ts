//Engine entry point

var mApplication : WDOH.Application;

window.onload = function () {
    mApplication = new WDOH.Application(
        new TestGame.TG_Logic(window.innerWidth / window.innerHeight),
        "TestGame"
    );

    if (mApplication !== null) {
        mApplication.init();
        mApplication.run();
    }
}
