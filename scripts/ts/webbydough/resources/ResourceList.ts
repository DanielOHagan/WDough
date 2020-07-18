namespace WDOH {

    /**
     * A ResourceList instance holds an Application's resource IDs in different arrays.
     *  Each array corresponds to a respective type; Texture, Sound, etc.
     */
    export class ResourceList {

        private mUsedTextureIds : number[];
        private mUnusedTextureNextId : number;

        public constructor() {
            this.mUsedTextureIds = [];
            this.mUnusedTextureNextId = 0;
        }

        public generateUnusedTextureId() : number {
            while (this.mUnusedTextureNextId <= this.mUsedTextureIds.length) {
                this.mUnusedTextureNextId++;
            }

            this.mUsedTextureIds[this.mUsedTextureIds.length] = this.mUnusedTextureNextId;

            return this.mUnusedTextureNextId;
        }

        public getUsedTextureIds() : number[] {
            return this.mUsedTextureIds;
        }

        public addUsedTextureId(id : number) : void {
            this.mUsedTextureIds.concat(id);
        }
    }
}