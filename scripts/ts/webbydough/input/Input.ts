namespace WDOH {

    /**
     * Singleton and 'Impl' methods for ease-of-use and cleaner API for end user.
     */
    export class Input {

        public static readonly DEFAULT_KEY_INPUT_CODES : EKeyInputCode[] = [
            EKeyInputCode.KEY_A, EKeyInputCode.KEY_B, EKeyInputCode.KEY_C, EKeyInputCode.KEY_D, EKeyInputCode.KEY_E, 
            EKeyInputCode.KEY_F, EKeyInputCode.KEY_G, EKeyInputCode.KEY_H, EKeyInputCode.KEY_I, EKeyInputCode.KEY_J, 
            EKeyInputCode.KEY_K, EKeyInputCode.KEY_L, EKeyInputCode.KEY_M, EKeyInputCode.KEY_N, EKeyInputCode.KEY_O, 
            EKeyInputCode.KEY_P, EKeyInputCode.KEY_Q, EKeyInputCode.KEY_R, EKeyInputCode.KEY_S, EKeyInputCode.KEY_T, 
            EKeyInputCode.KEY_U, EKeyInputCode.KEY_V, EKeyInputCode.KEY_W, EKeyInputCode.KEY_X, EKeyInputCode.KEY_Y, 
            EKeyInputCode.KEY_Z,
            EKeyInputCode.KEY_0, EKeyInputCode.KEY_1, EKeyInputCode.KEY_2, EKeyInputCode.KEY_3, EKeyInputCode.KEY_4,
            EKeyInputCode.KEY_5, EKeyInputCode.KEY_6, EKeyInputCode.KEY_7, EKeyInputCode.KEY_8, EKeyInputCode.KEY_9
        ];

        private static INSTANCE : Input = new Input();

        private mKeyEventListeners : boolean = false;
        private mMouseEventListeners : boolean = false;

        private mPossibleKeyInputs : EKeyInputCode[] = [];

        private mPressedKeys : Map<EKeyInputCode, boolean> = new Map();
        // private mPressedMouseButtons : Map<EMouseInputCode, boolean> = new Map();
        private mMouseScreenPos : Vector2 = new Vector2(0, 0);

        private Input() {}

        public static get() : Input {
            return Input.INSTANCE;
        }

        public init(enableKeyEvents : boolean, enableMouseEvents : boolean, possibleKeyInputs : EKeyInputCode[]) {            
            if (enableKeyEvents) {
                Input.get().addKeyEventListeners();
            }
            
            if (enableMouseEvents) {
                Input.get().addMouseEventListeners();
            }

            Input.get().mKeyEventListeners = enableKeyEvents;
            Input.get().mMouseEventListeners = enableMouseEvents;
            Input.get().mPossibleKeyInputs = possibleKeyInputs;

            if (possibleKeyInputs.length > 1) {
                for (let keyCode of possibleKeyInputs) {
                    Input.get().setKeyPressedFlag(keyCode, false);
                }
            } else {
                for (let keyCode of Input.DEFAULT_KEY_INPUT_CODES) {
                    Input.get().setKeyPressedFlag(keyCode, false);
                }
            }
        }

        public onKeyDown(keyBoardEvent : KeyboardEvent) : void {
            if (!keyBoardEvent.repeat) {
                mApplication.onKeyEvent(new KeyEvent(keyBoardEvent, EEventType.INPUT_KEY_DOWN));
            }
        }
        
        public onKeyPress(keyBoardEvent : KeyboardEvent) : void {
            mApplication.onKeyEvent(new KeyEvent(keyBoardEvent, EEventType.INPUT_KEY_PRESS));
        }

        public onKeyUp(keyBoardEvent : KeyboardEvent) : void {
            mApplication.onKeyEvent(new KeyEvent(keyBoardEvent, EEventType.INPUT_KEY_UP));
        }

        public onMouseMove(mouseMoveEvent : MouseMoveEvent) : void {
            this.mMouseScreenPos.x = mouseMoveEvent.getPosX();
            this.mMouseScreenPos.y = mouseMoveEvent.getPosY();
        }

        public onMouseScroll() : void {

        }

        public setKeyPressedFlag(keyCode : EKeyInputCode, pressed : boolean) {
            Input.get().mPressedKeys.set(keyCode, pressed);
        }

        public addKeyEventListeners() : void {
            if (!Input.get().mKeyEventListeners) {
                window.addEventListener("keydown", Input.get().onKeyDown);
                window.addEventListener("keypress", Input.get().onKeyPress);
                window.addEventListener("keyup", Input.get().onKeyUp);

                mApplication.getLogger().infoWDOH("Added key event listeners");

                Input.get().mKeyEventListeners = !Input.get().mKeyEventListeners;
            }
        }

        public removeKeyEventListeners() : void {
            if (Input.get().mKeyEventListeners) {
                window.removeEventListener("keydown", Input.get().onKeyDown);
                window.removeEventListener("keypress", Input.get().onKeyPress);
                window.removeEventListener("keyup", Input.get().onKeyUp);

                mApplication.getLogger().infoWDOH("Removed key event listeners");

                Input.get().mKeyEventListeners = !Input.get().mKeyEventListeners;
            }
        }

        public addMouseEventListeners() : void {
            if (!Input.get().mMouseEventListeners) {
                mApplication.getLogger().infoWDOH("Added mouse event listeners");

                window.addEventListener("mousemove", event => {
                    mApplication.onMouseEvent(new MouseMoveEvent(event.offsetX, event.offsetY));
                });
                window.addEventListener("mousewheel", Input.get().onMouseScroll)

                //TODO:: MouseButtons

                Input.get().mMouseEventListeners = !Input.get().mMouseEventListeners;
            }
        }

        public removeMouseEventListeners() : void {
            if (Input.get().mMouseEventListeners) {
                mApplication.getLogger().infoWDOH("Removed mouse event listeners");

                window.removeEventListener("mousemove", event =>{});
                window.removeEventListener("mousewheel", Input.get().onMouseScroll);
                //TODO:: MouseButtons

                Input.get().mMouseEventListeners = !Input.get().mMouseEventListeners;
            }
        }


        public keyStringAsInputCode(keyString : string) : EKeyInputCode {
            
            //If key inputs have not been limited
            if (Input.get().mPossibleKeyInputs.length < 1) {
                for (let keyCode of Input.DEFAULT_KEY_INPUT_CODES) {
                    if (keyString === keyCode) {
                        return keyCode;
                    }
                }

                return EKeyInputCode.UNKNOWN;
            }

            //If limits have been placed on which keys can be pressed
            for (let keyCode of Input.get().mPossibleKeyInputs) {
                if (keyString === keyCode.valueOf()) {
                    return keyCode;
                }
            }

            return EKeyInputCode.INGORED;
        }

        public static isKeyPressed(keyCode : EKeyInputCode) : boolean {
            return Input.get().isKeyPressedImpl(keyCode)
        }

        public isKeyPressedImpl(keyCode : EKeyInputCode) : boolean {
            let pressed : boolean | undefined = Input.get().mPressedKeys.get(keyCode);
            return pressed !== undefined && pressed;
        }

        public getMouseScreenPos() : Vector2 {
            return this.mMouseScreenPos;
        }
    }
}