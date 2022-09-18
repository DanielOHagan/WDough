namespace WDOH {

    export class UINodeHTML implements IUINode {

        protected mUIElement : HTMLElement;
        protected mDisplayed : boolean;

        public constructor(element : HTMLElement) {
            this.mUIElement = element;
            this.mDisplayed = true;
        }

        public getUIElement() : HTMLElement {
            return this.mUIElement;
        }

        public display(display : boolean) : void {
            this.mDisplayed = display;
            //if (display) {
            //    this.mUIElement.classList.remove("hidden");
            //} else {
            //    this.mUIElement.classList.add("hidden");
            //}
            this.mUIElement.style.display = display ? "inline" : "none";
        }

        public isDisplayed() : boolean {
            return this.mDisplayed;
        }
    }
}
