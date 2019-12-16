namespace wDOH {

    export interface IRendererAPI {

        init() : void;

        setClearColour(colour : Vector4) : void;
        setViewport(x : number, y : number, width : number, height : number) : void;

        clear() : void;

        drawIndexed(count : number) : void;

    }
}