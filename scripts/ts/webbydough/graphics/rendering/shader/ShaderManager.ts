namespace wDOH {

    export class ShaderManager {

        private mShaders : Map<string, IShader>;

        public constructor() {
            this.mShaders = new Map<string, IShader>();
        }

        public create(name : string, sources : Map<EShaderType, string>) : IShader | null {
            if (this.mShaders.has(name)) {
                throw new Error(`Shader name already in use: ${name}`);
            } else {
                let shader : IShader = ShaderWebGL.create(name, sources);

                this.mShaders.set(shader.getName(), shader);

                return shader;
            }

            return null;
        }

        public add(name : string, shader : IShader) : void {
            if (!this.mShaders.has(name)) {
                this.mShaders.set(name, shader);
            } else {
                throw new Error(`Shader: ${name} already in use.`);
            }
        }

        public set(name : string, shader : IShader) : void {
            if (this.mShaders.has(name)) {
                this.mShaders.set(name, shader);
            } else {
                throw new Error(`Shader: ${name} not found.`);
            }
        }

        public remove(name : string) : void {
            this.mShaders.delete(name);

            //Log the shader deletion
        }
    }
}