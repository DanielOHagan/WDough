namespace wDOH {

    export class Renderer {

        //EVERYTHING HERE IS VERY TEMP
        
        public static drawIndexed(
            shader : IShader,
            vertexVAO : IVertexArray,
            offset : number = 0
        ) : void {
            shader.bind();
            vertexVAO.bind();

            mContext.drawElements(
                mContext.TRIANGLES,
                vertexVAO.getIndexBuffer().getCount(),
                mContext.UNSIGNED_INT,
                offset
            );
        }

        public static drawArray(shader : IShader, vertexVAO : IVertexArray) : void {
            //TODO:: Make this draw call dynamicc
            shader.bind();
            vertexVAO.bind();

            mContext.drawArrays(mContext.TRIANGLES, 0, 3);
        }
    }
}