namespace TestGame {

    export class TG_Logic implements wDOH.IApplicationLogic {
        
        private mShaderMangaer : wDOH.ShaderManager | null = null;

        private vertexSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "in vec3 aVertPos;",
            "",
            "void main() {",
                "gl_Position = vec4(aVertPos, 1.0);",
            "}"
        ].join("\n");
            
        private fragmentSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform vec4 uColour;",
            "",
            "out vec4 fragColour;",
            "",
            "void main() {",
                "fragColour = uColour;",
            "}"
        ].join("\n");

        private mSquareVertices : number[] = [
            //top left
            -0.5,  0.5, 0.0,
            //top right
            0.5,  0.5, 0.0,
            //bottom right
            0.5, -0.5, 0.0,
            //bottom left
            -0.5, -0.5, 0.0
        ];

        private mSquareIndices : number[] = [
            0, 1, 2,
            2, 3, 0
        ];

        private mFlatColourShader : wDOH.IShader | null = null;
        private mFlatColour : wDOH.Vector4f = new wDOH.Vector4f(0.0, 1.0, 0.0, 1.0);

        public init() : void {
            console.log("TG_Logic: init");

            this.mShaderMangaer = new wDOH.ShaderManager();

            let sources : Map<wDOH.EShaderType, string> = new Map();
            sources.set(wDOH.EShaderType.VERTEX, this.vertexSrc);
            sources.set(wDOH.EShaderType.FRAGMENT, this.fragmentSrc);

            this.mFlatColourShader = this.mShaderMangaer.create("FlatColourShader", sources);

            if (this.mFlatColourShader !== null) {
                this.mFlatColourShader.createUniform("uColour");
            }
        }
        
        public update(deltaTime: number) : void {
            
            //console.log("TG_Logic: update");
            if (this.mFlatColourShader !== null) {
                (this.mFlatColourShader as wDOH.ShaderWebGL).setUniform4f("uColour", this.mFlatColour);


            }

        }
    }
}