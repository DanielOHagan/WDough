namespace WDOH {

    export class TextureLoader {

        public static loadTextureFromFile(filePath : string, bindingPoint : ETextureBindingPoint) : ITexture {
            let texture : ITexture = TextureWebGL.loadFromFile(filePath, bindingPoint);

            if (texture.hasLoaded()) {
                return texture;
            } else {
                throw new Error(`Failed to load texture: ${filePath}`);
            }
        }

        public static generateTexture(width : number, height : number, bindingPoint : ETextureBindingPoint) : ITexture {
            if (width <= 0 || height <= 0) {
                throw new Error("Width and Height must be larger than 0.");
            }

            return TextureWebGL.generateTexture(width, height, bindingPoint);
        }

        public static generateColourTexture(
            width : number,
            height : number,
            rgbaColourData : Uint8Array,
            bindingPoint : ETextureBindingPoint
        ) : ITexture {
            if (width <= 0 || height <= 0) {
                throw new Error("Width and Height must be larger than 0.");
            }

            if (rgbaColourData.length % 4 !== 0) {
                throw new Error("rgbaColourData argument must include 4 data channels in Uint8Array.")
            }

            let texture : ITexture = TextureWebGL.generateTexture(width, height, bindingPoint);
            texture.setData(rgbaColourData);

            return texture;
        }
    }
}