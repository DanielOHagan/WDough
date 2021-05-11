namespace WDOH {
    
    export class BoundingBox2D<T extends AGeometry2D> {

        private mWrappedNode : T;

        public constructor(wrappedNode : T) {
            this.mWrappedNode = wrappedNode;
        }

        /**
         * Check if another bounding box is overlapping this bouding box.
         * 
         * @param boundingBox The bouding box to be checked for overlapping this bounding box.
         * @returns True if passed bounding box overlaps with this bounding box.
         */
        public areBoundingBox2DsOverlaping(boundingBox : BoundingBox2D<AGeometry2D>) : boolean {
            if (
                boundingBox.mWrappedNode.mPosition.x > this.mWrappedNode.mPosition.x + this.mWrappedNode.mSize.x ||
                boundingBox.mWrappedNode.mPosition.x + boundingBox.mWrappedNode.mSize.x < this.mWrappedNode.mPosition.x
            ) return false;
            if (
                boundingBox.mWrappedNode.mPosition.y + boundingBox.mWrappedNode.mSize.y < this.mWrappedNode.mPosition.y ||
                boundingBox.mWrappedNode.mPosition.y > this.mWrappedNode.mPosition.y + this.mWrappedNode.mSize.y
            ) return false;

            return true;
        }

        /**
         * Check if a 2D point is inside of the bounding box.
         * 
         * @param vec2 The 2D point to check.
         * @returns True is vec2 point is inside this bounding box.
         */
        public isVec2Inside(vec2 : Vector2) : boolean {
            return !(vec2.y < this.mWrappedNode.mPosition.y) &&
                !(vec2.y > this.mWrappedNode.mPosition.y + this.mWrappedNode.mSize.y) &&
                !(vec2.x > this.mWrappedNode.mPosition.x + this.mWrappedNode.mSize.x || vec2.x < this.mWrappedNode.mPosition.x);
        }

        public getWrappedNode() : T {
            return this.mWrappedNode;
        }
    }
}
