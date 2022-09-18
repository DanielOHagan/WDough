namespace WDOH {

    export class TextureLoader {

        public static loadTextureFromFile(filePath : string, bindingPoint : ETextureBindingPoint) : ITexture {
            let texture : ITexture = TextureWebGL.loadFromFile(filePath, bindingPoint);

            if (texture.isDefined()) {
                return texture;
            } else {
                _Logger().errWDOH(`Failed to load texture: ${filePath}`);
                return Renderer2DStorage.mErrorTexture;
            }
        }

        public static generateTexture(width : number, height : number, bindingPoint : ETextureBindingPoint) : ITexture {
            if (width <= 0 || height <= 0) {
                _Logger().errWDOH("Width and Height must be larger than 0.")
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
                _Logger().errWDOH("Width and Height must be larger than 0.");
            }

            if (rgbaColourData.length % 4 !== 0) {
                _Logger().errWDOH("rgbaColourData argument must include 4 data channels in Uint8Array.");
            }

            let texture : ITexture = TextureWebGL.generateTexture(width, height, bindingPoint);
            texture.setData(rgbaColourData);

            return texture;
        }
    }
}
