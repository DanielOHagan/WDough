namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {
        
        private mShaderMangaer : WDOH.ShaderManager | null = null;

        private vertexSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform mat4 uProjectionViewMatrix;",
            "uniform mat4 uTransformationViewMatrix;",
            "",
            "in vec3 aVertPos;",
            "",
            "void main() {",
                "gl_Position = uProjectionViewMatrix * uTransformationViewMatrix * vec4(aVertPos, 1.0);",
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

        private mFlatColourShader : WDOH.IShader | null;
        private mFlatColour : WDOH.Vector4;

        private mSquareVAO : WDOH.IVertexArray | null;

        private mOrthoCameraController : WDOH.ICameraController;

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mSquareVAO = null;
            this.mFlatColour = new WDOH.Vector4(0, 1, 0, 1);
            this.mFlatColourShader = null;
        }

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

            this.mSquareVAO = new WDOH.VertexArrayWebGL();
            let squareVBO : WDOH.IVertexBufer = new WDOH.VertexBufferWebGL(
                this.mSquareVertices,
                this.mSquareVertices.length * Float32Array.BYTES_PER_ELEMENT
            );
            squareVBO.setBufferLayout(new WDOH.BufferLayout([
                new WDOH.BufferElement("aVertPos", WDOH.EDataType.FLOAT3)
            ]))
            this.mSquareVAO.addVertexBuffer(squareVBO);
            let squareIB : WDOH.IIndexBuffer = new WDOH.IndexBufferWebGL(this.mSquareIndices);
            this.mSquareVAO.setIndexBuffer(squareIB);
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

                if (this.mSquareVAO !== null) {

                    for (let x = 0; x < 20; x++) {
                        for (let y = 0; y < 20; y++) {
                            let transformationMatrix : WDOH.Matrix4x4 = new WDOH.Matrix4x4();
                            let pos : WDOH.Vector3 = new WDOH.Vector3(x * 0.06, y * 0.06, 0.0);

                            //offset down and left
                            pos.x -= 0.5;
                            pos.y -= 0.5;

                            if (Math.random() < 0.8) {
                                (this.mFlatColourShader as WDOH.ShaderWebGL).setUniform4f("uColour", this.mFlatColour);
                            } else {
                                (this.mFlatColourShader as WDOH.ShaderWebGL).setUniform4f("uColour", new WDOH.Vector4(1, 1, 0, 1));
                            }

                            if (Math.random() < 0.02) {
                                transformationMatrix.rotateRads(WDOH.MathsWDOH.degToRad(45), new WDOH.Vector3(0, 0, 1));
                            }

                            transformationMatrix.scaleNum(0.05);
                            transformationMatrix.translateVec3(pos);

                            mApplication.getRenderer().submitShader(this.mFlatColourShader, this.mSquareVAO, transformationMatrix);
                        }
                    }
                }
            }


            mApplication.getRenderer().endScene();
        }

        public onEvent(event: WDOH.IEvent) : void {
            //No app logic related events have been created yet so this method is throws an error
            throw new Error("Method not implemented.");
        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mOrthoCameraController.onCanvasResize(aspectRatio)
        }
    }
}