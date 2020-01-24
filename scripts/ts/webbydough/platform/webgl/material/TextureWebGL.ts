namespace WDOH {

    export class TextureWebGL implements ITexture {

        public static readonly SUPPORTED_FILE_TYPES : string[] = ["png", "jpg"];
        public static readonly DEFAULT_MIPMAP_LOD : number = 0;

        private static readonly TEXTURE_PLACEHOLDER_DATA : Uint8Array = new Uint8Array(0);

        private mData : HTMLImageElement | null;
        private mHandle : WebGLTexture | null;
        private mBindingPoint : GLenum;
        private mWidth : number;
        private mHeight : number;
        private mLoaded : boolean;

        public constructor(filePath : string, bindingPoint : ETextureBindingPoint) {
            this.mLoaded = false;
            this.mWidth = 0;
            this.mHeight = 0;

            this.mBindingPoint = TextureWebGL.bindingPointToGLEeum(bindingPoint);

            let textureHandle : WebGLTexture | null = mContext.createTexture();

            if (textureHandle !== null) {
                this.mHandle = textureHandle;

                //Load data
                let image : HTMLImageElement = new Image();
                image.src = filePath;
                this.mData = image;
                image.onload = this.onHtmlImageLoad.bind(this, image);

                this.bind();

                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_WRAP_S, mContext.CLAMP_TO_EDGE);
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_WRAP_T, mContext.CLAMP_TO_EDGE);
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_MIN_FILTER, mContext.LINEAR);
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_MAG_FILTER, mContext.NEAREST);

                //Since image has to be laoded first, we have to store some placeholder data
                mContext.texImage2D(
                    mContext.TEXTURE_2D,
                    TextureWebGL.DEFAULT_MIPMAP_LOD,
                    mContext.RGBA,
                    0,
                    0,
                    0,
                    mContext.RGBA,
                    mContext.UNSIGNED_BYTE,
                    TextureWebGL.TEXTURE_PLACEHOLDER_DATA
                );

                this.mLoaded = true;
                
            } else {
                this.mHandle = null;
                this.mData = null;
            }
        }

        public getWidth() : number {
            return this.mWidth;
        }

        public getHeight() : number {
            return this.mHeight;
        }

        public getHandle() : WebGLTexture | null {
            return this.mHandle;
        }

        public activate(textureSlot : number) : void {            
            mContext.activeTexture(mContext.TEXTURE0 + textureSlot);
        }
        
        public bind() : void {
            mContext.bindTexture(this.mBindingPoint, this.mHandle);
        }

        public unBind() : void {
            mContext.bindTexture(this.mBindingPoint, null);
        }

        public delete() : void {
            mContext.deleteTexture(this.mHandle);
            this.mLoaded = false;
        }

        public hasLoaded() : boolean {
            return this.mLoaded;
        }

        public cleanUp() : void {
            this.unBind();
            this.delete();
        }

        private onHtmlImageLoad(htmlImage : HTMLImageElement) : void {
            //Get data from the image element
            this.mWidth = htmlImage.width;
            this.mHeight = htmlImage.height;

            if (this.mData !== null) {
                //Bind and upload data
                this.bind();
                mContext.texImage2D(
                    mContext.TEXTURE_2D,
                    TextureWebGL.DEFAULT_MIPMAP_LOD,
                    mContext.RGBA,
                    this.mWidth,
                    this.mHeight,
                    0,
                    mContext.RGBA,
                    mContext.UNSIGNED_BYTE,
                    this.mData
                );
                
                // mContext.texStorage2D(
                //     mContext.TEXTURE_2D,
                //     TextureWebGL.DEFAULT_MIPMAP_LOD,
                //     mContext.RGBA8,
                //     this.mWidth,
                //     this.mHeight,
                // );
                
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_WRAP_S, mContext.CLAMP_TO_EDGE);
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_WRAP_T, mContext.CLAMP_TO_EDGE);
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_MIN_FILTER, mContext.LINEAR);
                mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_MAG_FILTER, mContext.NEAREST);

                this.mLoaded = true;
            } else {
                this.mLoaded = false;
            }
        }

        private static bindingPointToGLEeum(bindingPoint : ETextureBindingPoint) : GLenum {
            switch (bindingPoint) {
                case ETextureBindingPoint.TEX_2D:
                    return mContext.TEXTURE_2D;
                case ETextureBindingPoint.TEX_CUBE_MAP:
                    return mContext.TEXTURE_CUBE_MAP;

                case ETextureBindingPoint.NONE:
                default:
                    throw new Error("Unknown Bindpoint enum or NONE");
                    break;
            }
        }
    }
}