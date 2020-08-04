namespace WDOH {

    export enum EFileTypeTextureWebGL {
        NONE = 0,

        PNG = "png",
        JPEG = "jpg"
    }

    export class TextureWebGL implements ITexture {

        private static readonly DEFAULT_MIPMAP_LOD : number = 0;
        private static readonly TEXTURE_PLACEHOLDER_DATA : Uint8Array = new Uint8Array(0);
        
        private mId : number;
        private mData : HTMLImageElement | null;
        private mHandle : WebGLTexture | null;
        private mBindingPoint : GLenum;
        private mWidth : number;
        private mHeight : number;
        private mLoaded : boolean;
        private mFileType : EFileTypeTextureWebGL;
        private mAlphaChannel : boolean;
        private mInternalFormat : GLenum;
        private mDataFormat : GLenum;

        private constructor(id : number, bindingPoint : ETextureBindingPoint) {
            this.mId = id;
            this.mData = null;
            this.mHandle = null;
            this.mBindingPoint = TextureWebGL.bindingPointToGLEeum(bindingPoint);
            this.mWidth = 0;
            this.mHeight = 0;
            this.mLoaded = false;
            this.mFileType = EFileTypeTextureWebGL.NONE;
            this.mAlphaChannel = false;
            this.mInternalFormat = mContext.NONE;
            this.mDataFormat = mContext.NONE;
        }

        public static loadFromFile(filePath : string, bindingPoint : ETextureBindingPoint) : ITexture {
            let textureId : number = mApplication.getResourceList().generateUnusedTextureId();
            let texture : TextureWebGL = new TextureWebGL(textureId, bindingPoint);

            texture.mBindingPoint = TextureWebGL.bindingPointToGLEeum(bindingPoint);

            let textureHandle : WebGLTexture | null = mContext.createTexture();

            if (textureHandle !== null) {
                texture.mHandle = textureHandle;

                //Load data
                let image : HTMLImageElement = new Image();
                image.src = filePath;
                texture.mData = image;
                image.onload = texture.onHtmlImageLoad.bind(this, image);

                texture.bind();

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

                texture.mLoaded = true;
            } else {
                texture.mHandle = null;
                texture.mData = null;
            }

            return texture;
        }

        public static generateTexture(width : number, height : number, bindingPoint : ETextureBindingPoint) : ITexture {
            let textureId : number = mApplication.getResourceList().generateUnusedTextureId();
            let texture : TextureWebGL = new TextureWebGL(textureId, bindingPoint);

            texture.mWidth = width;
            texture.mHeight = height;
            texture.mFileType = EFileTypeTextureWebGL.NONE;
            texture.mAlphaChannel = true;

            texture.mInternalFormat = mContext.RGBA8;
		    texture.mDataFormat = mContext.RGBA;

            texture.mHandle = mContext.createTexture();

            texture.bind();
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
        
            mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_WRAP_S, mContext.CLAMP_TO_EDGE);
            mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_WRAP_T, mContext.CLAMP_TO_EDGE);
            mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_MIN_FILTER, mContext.LINEAR);
            mContext.texParameteri(mContext.TEXTURE_2D, mContext.TEXTURE_MAG_FILTER, mContext.NEAREST);

            texture.mLoaded = true;

            return texture;
        }

        public getId() : number {
            return this.mId;
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

        public setData(data : ArrayBufferView) : void {
            mContext.bindTexture(mContext.TEXTURE_2D, this.mHandle);
            mContext.texImage2D(
                mContext.TEXTURE_2D,
                TextureWebGL.DEFAULT_MIPMAP_LOD,
                this.mInternalFormat,
                this.mWidth,
                this.mHeight,
                0,
                this.mDataFormat,
                mContext.UNSIGNED_BYTE,
                data
            );
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
            if (this.mData !== null) {
                //Get data from the image element
                this.mWidth = htmlImage.width;
                this.mHeight = htmlImage.height;

                //Determine file type
                let extension : string | undefined = htmlImage.src.split('.').pop()?.toLowerCase();

                if (extension === undefined) {
                    this.mFileType = EFileTypeTextureWebGL.NONE
                }

                switch(extension) {
                    case EFileTypeTextureWebGL.JPEG:
                        this.mFileType = EFileTypeTextureWebGL.JPEG;
                        this.mAlphaChannel = false;
                        break;
                    case EFileTypeTextureWebGL.PNG:
                        this.mFileType = EFileTypeTextureWebGL.PNG;
                        this.mAlphaChannel = true;
                        break;
                }
                
                if (this.mFileType === EFileTypeTextureWebGL.NONE) {
                    let msg : string = "Unable to determine image type. Src: " + htmlImage.src;
                    this.cleanUp();
                    throw new Error(msg);
                }
                
                //Bind and upload data
                this.bind();

                let internalFormat : GLint;
                let format : GLint;

                if (this.mAlphaChannel) {
                    internalFormat = mContext.RGBA;
                    format = mContext.RGBA;
                } else {
                    internalFormat = mContext.RGB;
                    format = mContext.RGB;
                }

                mContext.texImage2D(
                    mContext.TEXTURE_2D,
                    TextureWebGL.DEFAULT_MIPMAP_LOD,
                    internalFormat,
                    this.mWidth,
                    this.mHeight,
                    0,
                    format,
                    mContext.UNSIGNED_BYTE,
                    this.mData
                );
                
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
            }
        }
    }
}