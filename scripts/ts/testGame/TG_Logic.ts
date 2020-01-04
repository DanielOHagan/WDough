namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {
        
        private mShaderMangaer : WDOH.ShaderManager | null = null;

        private vertexSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform mat4 uProjectionViewMatrix;",
            "",
            "in vec3 aVertPos;",
            "",
            "void main() {",
                "gl_Position = uProjectionViewMatrix * vec4(aVertPos, 1.0);",
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

        private mFlatColourShader : WDOH.IShader | null = null;
        private mFlatColour : WDOH.Vector4 = new WDOH.Vector4(1.0, 1.0, 0.0, 1.0);

        private squareVAO : WDOH.IVertexArray | null = null;

        private mOrthoCameraController : WDOH.ICameraController = new TG_OrthoCameraController(1280 / 720);

        public init() : void {
            console.log("TG_Logic: init");

            this.mShaderMangaer = new WDOH.ShaderManager();

            let sources : Map<WDOH.EShaderType, string> = new Map();
            sources.set(WDOH.EShaderType.VERTEX, this.vertexSrc);
            sources.set(WDOH.EShaderType.FRAGMENT, this.fragmentSrc);

            this.mFlatColourShader = this.mShaderMangaer.create("FlatColourShader", sources);

            if (this.mFlatColourShader !== null) {
                this.mFlatColourShader.createUniform("uColour");
            }

            this.squareVAO = new WDOH.VertexArrayWebGL();
            let squareVBO : WDOH.IVertexBufer = new WDOH.VertexBufferWebGL(
                this.mSquareVertices,
                this.mSquareVertices.length * Float32Array.BYTES_PER_ELEMENT
            );
            squareVBO.setBufferLayout(new WDOH.BufferLayout([
                new WDOH.BufferElement("aVertPos", WDOH.EDataType.FLOAT3)
            ]))
            this.squareVAO.addVertexBuffer(squareVBO);
            let squareIB : WDOH.IIndexBuffer = new WDOH.IndexBufferWebGL(this.mSquareIndices);
            this.squareVAO.setIndexBuffer(squareIB);
        }
        
        public update(deltaTime: number) : void {

            if (Math.random() * 10 <= 0.5) {
                //NOTE:: The *Camera* is being moved NOT the scene!
                // this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0.03, 0, 0));
                // this.mOrthoCameraController.rotateDegrees(0.5);
            }

            this.mOrthoCameraController.onUpdate(deltaTime);

            mApplication.getRenderer().beginScene(this.mOrthoCameraController.getCamera());
            
            if (this.mFlatColourShader !== null) {
                this.mFlatColourShader.bind();
                (this.mFlatColourShader as WDOH.ShaderWebGL).setUniform4f("uColour", this.mFlatColour);

                if (this.squareVAO !== null) {
                    mApplication.getRenderer().submitShader(this.mFlatColourShader, this.squareVAO, new WDOH.Matrix4x4());
                }
            }


            mApplication.getRenderer().endScene();
        }

        public onEvent(event: WDOH.IEvent) : void {
            //No app logic related events have been created yet so this method is throws an error
            throw new Error("Method not implemented.");
        }
    }
}