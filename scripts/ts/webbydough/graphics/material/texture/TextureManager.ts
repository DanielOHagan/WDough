namespace WDOH {

    export class TextureManager {

        private mTextureMap : Map<string, ITexture>;

        public constructor() {
            this.mTextureMap = new Map();
        }

        public createTexture(filePath : string, bindingPoint : ETextureBindingPoint) : ITexture {
            if (this.mTextureMap.has(filePath)) {
                console.log("Texture already stored, returning stored texture");

                if (this.mTextureMap.get(filePath) !== undefined) {
                    return this.mTextureMap.get(filePath) as ITexture;
                }
            }

            let texture : ITexture = new TextureWebGL(filePath, bindingPoint);

            if (texture.hasLoaded()) {
                this.mTextureMap.set(filePath, texture);
                return texture;
            } else {
                throw new Error(`Failed to load texture: ${filePath}`);
            }
        }

        public removeTextureByFilePath(filePath : string) : void {
            this.mTextureMap.delete(filePath);
        }

        public removeTextureInstance(texture : ITexture) : void {
            for (let key of this.mTextureMap.keys()) {
                if (this.mTextureMap.get(key) === texture) {
                    this.mTextureMap.delete(key);
                }
            }
        }
        
        public flushTextures() : void {
            this.mTextureMap.clear();
        }

        private cleanUp() : void {
            for (let key of this.mTextureMap.keys()) {
                if (this.mTextureMap.get(key) !== undefined) {
                    (this.mTextureMap.get(key) as ITexture).cleanUp();
                }
            }
        }
    }
}