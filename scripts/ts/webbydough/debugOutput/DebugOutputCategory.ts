namespace WDOH {

    export class DebugOutputCategory implements IToHTML {

        private readonly mName : string;

        private mItemToField : Map<string, IUIFieldInOut>;

        //Set when a getAs__() is called. As that is when it is created.
        //TODO:: Could be switched to a Map<EUIType, IUINode> when other UI types are added.
        //          Or use <T> templates to support different types.
        private mDisplayNode : IUINode | null;

        public constructor(name : string) {
            this.mName = name;
            this.mItemToField = new Map();
            this.mDisplayNode = null;
        }

        public addItem(name : string, value : string) : void {
            //TODO:: make this UI platform abstract, if templates are used then a static T.createUIField() function to create the element
            this.mItemToField.set(name, new UIFieldInOutHTML(document.createElement("div"), value));
        }

        public updateValue(name : string, value : string) : void {
            let item : IUIFieldInOut | undefined = this.mItemToField.get(name);
            if (item !== undefined) {
                item.updateValue(value);
            } else {
                _Logger().warnWDOH(`Category: ${this.mName} does not have: ${name}`);
            }
        }

        public removeItem(itemName : string) : void {
            this.mItemToField.delete(itemName);
        }

        public getName() : string {
            return this.mName;
        }

        public getAsHTML() : HTMLElement {
            let root : HTMLDivElement = document.createElement("div");

            //Attach title
            let titleParagraph : HTMLParagraphElement = document.createElement("p");
            titleParagraph.innerText = this.mName;
            root.appendChild(titleParagraph);

            //Attach items
            let itemList : HTMLUListElement = document.createElement("ul");

            for (let entry of this.mItemToField.entries()) {
                let item : HTMLLIElement = document.createElement("li");
                let itemTitle : HTMLDivElement = document.createElement("div");
                let divider : HTMLDivElement = document.createElement("div");
                let itemValue : HTMLDivElement = entry[1].getUIElement() as HTMLDivElement;

                itemTitle.innerText = entry[0];
                itemTitle.style.display = "inline";

                divider.innerText = ": ";
                divider.style.display = "inline";

                itemValue.innerText = entry[1].getValue();
                itemValue.style.display = "inline";
                itemValue.style.float = "right";

                item.appendChild(itemTitle);
                item.appendChild(divider);
                item.appendChild(itemValue);

                itemList.appendChild(item);
            }

            root.appendChild(itemList);

            this.mDisplayNode = new UINodeHTML(root);

            return root;
        }
    }
}
