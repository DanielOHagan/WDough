namespace WDOH {

    export class TextureManager {

        private mTextureMap : Map<string, ITexture>;

        public constructor() {
            this.mTextureMap = new Map();
        }

        public createTexture(filePath : string, textureName : string, bindingPoint : ETextureBindingPoint) : ITexture {
            if (this.mTextureMap.has(textureName)) {

                mApplication.getLogger().infoApp("Texture already stored, returning stored texture");

                if (this.mTextureMap.get(textureName) !== undefined) {
                    return this.mTextureMap.get(textureName) as ITexture;
                }
            }

            let texture : ITexture = new TextureWebGL(filePath, bindingPoint);

            if (texture.hasLoaded()) {
                this.mTextureMap.set(textureName, texture);
                return texture;
            } else {
                throw new Error(`Failed to load texture: ${filePath}`);
            }
        }

        public getTextureByName(textureName : string) : ITexture | null {
            if (this.mTextureMap.has(textureName)) {
                return (this.mTextureMap.get(textureName) as ITexture);
            }

            mApplication.getLogger().infoApp("Texture name not found. Returning null.");
            return null;
        }

        public removeTextureByName(textureName : string) : void {
            this.mTextureMap.delete(textureName);
        }

        public removeTextureInstance(texture : ITexture) : void {
            for (let key of this.mTextureMap.keys()) {
                if (this.mTextureMap.get(key) === texture) {
                    (this.mTextureMap.get(key) as ITexture).cleanUp();
                    this.mTextureMap.delete(key);
                }
            }
        }

        public cleanUp() : void {
            for (let key of this.mTextureMap.keys()) {
                if (this.mTextureMap.get(key) !== undefined) {
                    (this.mTextureMap.get(key) as ITexture).cleanUp();
                }
            }
            this.mTextureMap.clear();
        }
    }
}