namespace WDOH {

    export class DebugOutput implements /*ILogger,*/ IToHTML {

        private static readonly NAME : string = "Debug Output";
        private static readonly HTML_CLASS : string = "wdoh-debug-output";

        private mIdToCategory : Map<number, DebugOutputCategory>;
        private mIndexOrderToCategoryId : Map<number, number>;
        private mNextAvailableCategoryId : number;
        private mNextAvailableCategoryOrder : number;

        private mDisplayed : boolean;
        private mDisplayNode : IUINode;

        public constructor() {
            this.mIdToCategory = new Map();
            this.mIndexOrderToCategoryId = new Map();
            this.mNextAvailableCategoryId = 0;
            this.mNextAvailableCategoryOrder = 0;
            this.mDisplayed = true;
            this.mDisplayNode = new UINodeHTML(document.createElement("div"));
        }

        public display(display : boolean) : void {
            this.mDisplayed = display;
            if (this.mDisplayNode !== null) {
                this.mDisplayNode.display(display);
            }
        }

        public addCategory(categoryName : string) : DebugOutputCategory | null {
            let categoryId : number = this.mNextAvailableCategoryId.valueOf();

            for (let category of this.mIdToCategory.values()) {
                if (categoryName === category.getName()) {
                    _Logger().warnWDOH(`Category name : ${categoryName} taken.`);
                    return null;
                }
            }

            let category : DebugOutputCategory = new DebugOutputCategory(categoryName);
            this.mIdToCategory.set(categoryId, category);
            this.mNextAvailableCategoryId++;
            this.mIndexOrderToCategoryId.set(this.mNextAvailableCategoryOrder.valueOf(), categoryId)
            this.mNextAvailableCategoryOrder++;

            return category;
        }

        public getCategoryByName(categoryName : string) : DebugOutputCategory | null {
            for (let category of this.mIdToCategory.values()) {
                if (categoryName === category.getName()) {
                    return category;
                }
            }

            return null;
        }

        public getAsHTML() {
            //let root : HTMLDivElement = document.createElement("div");
            let root : HTMLDivElement = this.mDisplayNode.getUIElement() as HTMLDivElement;
            root.className = DebugOutput.HTML_CLASS;
            root.style.display = this.mDisplayed ? "inline" : "none";
            //Attach title section
            let titleParagraph : HTMLParagraphElement = document.createElement("p");
            titleParagraph.innerText = DebugOutput.NAME;
            root.appendChild(titleParagraph);

            //Attach each category
            //TODO:: Attach categories in order
            for (let category of this.mIdToCategory.values()) {
                root.appendChild(category.getAsHTML());
            }

            //Attach logger outputs


            return root;
        }
    }
}
