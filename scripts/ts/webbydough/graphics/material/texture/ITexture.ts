namespace WDOH {

    export interface ITexture {

        isDefined() : boolean;

        getId() : number;

        getWidth() : number;
        getHeight() : number;
        hasLoaded() : boolean;

        activate(textureSlot : number) : void;
        bind() : void;
        unBind() : void;

        setData(data : ArrayBufferView) : void;
        delete() : void;

        cleanUp() : void;
    }
}