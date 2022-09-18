namespace WDOH {

    export class UIFieldInOutHTML implements IUIFieldInOut {

        private mValue : string;
        private mUIElement : HTMLElement;

        public constructor(element : HTMLElement, value : string) {
            this.mUIElement = element;
            this.mValue = value;
        }

        public display(display : boolean) : void {
            this.mUIElement.style.display = display ? "inline" : "none";
        }

        public isDisplayed() : boolean {
            return !(this.mUIElement.style.display === "none" || this.mUIElement.style.display === "hidden");
        }

        public updateValue(value : string) : void {
            this.mValue = value;
            // super.mUIElement.innerText = this.mValue;
            this.mUIElement.innerText = this.mValue;

        }

        public getValue() : string {
            return this.mValue;
        }

        public getUIElement() : HTMLElement {
            return this.mUIElement;
        }
    }
}
