namespace WDOH {

    export interface ITexture {

        getWidth() : number;
        getHeight() : number;

        activate(textureSlot : number) : void;
        bind() : void;
        unBind() : void;
        
        delete() : void;
        
        hasLoaded() : boolean;

        cleanUp() : void;
    }
}