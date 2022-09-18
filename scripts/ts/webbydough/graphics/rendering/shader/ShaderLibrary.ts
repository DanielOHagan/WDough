namespace WDOH {

    export class ShaderLibrary {

        private mShaderMap : Map<string, IShader>;

        public constructor() {
            this.mShaderMap = new Map<string, IShader>();
        }

        /**
         * Does not add the created shader to ShaderLibrary instance's mShaderMap
         * @param name Unique identifier name of shader
         * @param sources Source code for shader with respective type
         * @returns IShader instance created from the given sources
         */
        public static loadSeparatedShader(name : string, sources : Map<EShaderType, string>) : IShader {
            let shader : IShader = ShaderWebGL.create(name, sources);
            return shader;
        }

        /**
         * Creates an IShader reference and adds it to the ShaderLibrary instance's mShaderMap,
         *  the shader can then be referenced by this method's return value or by calling
         *  the get() method using the same name argument as the one passed here
         * @param name Unique identifier name of shader
         * @param sources Source code for shader with respective type
         * @returns IShader instance created from the given sources
         */
        public create(name : string, sources : Map<EShaderType, string>) : IShader | null {
            if (this.mShaderMap.has(name)) {
                mApplication.throwError(`Shader name already in use : ${name}`);
                return null;
            } else {
                let shader : IShader = ShaderLibrary.loadSeparatedShader(name, sources);

                this.mShaderMap.set(shader.getName(), shader);

                return shader;
            }
        }

        public add(name : string, shader : IShader) : void {
            if (!this.mShaderMap.has(name)) {
                this.mShaderMap.set(name, shader);
            } else {
                throw new Error(`Shader : ${name} already in use.`);
            }
        }

        public set(name : string, shader : IShader) : void {
            if (this.mShaderMap.has(name)) {
                this.mShaderMap.set(name, shader);
            } else {
                mApplication.throwError(`Shader : ${name} not found.`);
            }
        }

        public get(name : string) : IShader | null {
            for (let shaderName of this.mShaderMap.keys()) {
                if (name === shaderName) {
                    if (this.mShaderMap.get(name) !== undefined) {
                        return this.mShaderMap.get(name) as IShader;
                    }
                }
            }

            return null;
        }

        public remove(name : string) : void {
            this.mShaderMap.delete(name);
        }

        public clear() : void {
            this.mShaderMap.clear();
        }
    }
}
