namespace WDOH {

    export class ShaderManager {

        private mShaderMap : Map<string, IShader>;

        public constructor() {
            this.mShaderMap = new Map<string, IShader>();
        }

        public create(name : string, sources : Map<EShaderType, string>) : IShader | null {
            if (this.mShaderMap.has(name)) {
                throw new Error(`Shader name already in use: ${name}`);
            } else {
                let shader : IShader = ShaderWebGL.create(name, sources);

                this.mShaderMap.set(shader.getName(), shader);

                return shader;
            }

            return null;
        }

        public add(name : string, shader : IShader) : void {
            if (!this.mShaderMap.has(name)) {
                this.mShaderMap.set(name, shader);
            } else {
                throw new Error(`Shader: ${name} already in use.`);
            }
        }

        public set(name : string, shader : IShader) : void {
            if (this.mShaderMap.has(name)) {
                this.mShaderMap.set(name, shader);
            } else {
                throw new Error(`Shader: ${name} not found.`);
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

    }
}