namespace WDOH {

    export class BoundingBox2D<T extends AGeometry2D> implements ISceneNode {

        private mWrappedNode : T;
        private mBindRotation : boolean;
        private mRotation : number;

        /**
         * Create a "wrapping" BoundingBox2D with a reference to the "wrapped" geometry.
         * 
         * @param wrappedNode The Geometry to wrap.
         */
        public constructor(wrappedNode : T, bindRotation : boolean = true) {
            this.mWrappedNode = wrappedNode;
            this.mBindRotation = bindRotation;
            this.mRotation = this.mBindRotation ? this.mWrappedNode.getRotationRadians() : 0;
        }

        /**
         * 
         * 
         * @override ISceneNode getGeometry()
         * @returns 
         */
        public getGeometry() : T {
            return this.mWrappedNode;
        }

        /**
         * Check if another bounding box is overlapping this bounding box.
         * 
         * @param boundingBox The bouding box to be checked for overlapping this bounding box.
         * @returns True if passed bounding box overlaps with this bounding box.
         */
        public overlaps(boundingBox : BoundingBox2D<AGeometry2D>) : boolean {
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
         * Check if this bounding box encloses the given boundingBox.
         * 
         * @param boundingBox The bounding box to check if enclosed.
         * @returns True if given bounding box is enclosed by this bounding box. False if not completely enclosed.
         */
        public encloses(boundingBox : BoundingBox2D<AGeometry2D>) : boolean {
            //Check if top right and bottom left points are inside this bounding box.
            if (!this.isVec2InsideXY(
                boundingBox.getPosition().x + boundingBox.getSize().x,
                boundingBox.getPosition().y + boundingBox.getSize().y
            )) return false;
            if (!this.isVec2InsideXY(
                boundingBox.getPosition().x,
                boundingBox.getPosition().y
            )) return false;

            return true;
        }

        /**
         * Check if a 2D point is inside of the bounding box.
         * 
         * @param vec2 The 2D point to check.
         * @returns True if vec2 point is inside this bounding box.
         */
        public isVec2Inside(vec2 : Vector2) : boolean {
            return this.isVec2InsideXY(vec2.x, vec2.y);
        }

        /**
         * Check if a 2D point is inside of the bounding box.
         * 
         * @param x X value.
         * @param y Y Value.
         * @returns True if coordinate is inside this bounding box.
         */
        public isVec2InsideXY(x : number, y : number) : boolean {
            return !(y <= this.mWrappedNode.mPosition.y) &&
                !(y >= this.mWrappedNode.mPosition.y + this.mWrappedNode.mSize.y) &&
                !(x >= this.mWrappedNode.mPosition.x + this.mWrappedNode.mSize.x || x <= this.mWrappedNode.mPosition.x);
        }

        /**
         * Check if a 2D point is inside of the bounding box, but doesn't include the edge of the bounding box.
         * 
         * @param vec2 The 2D point to check.
         * @returns True if coordinate is inside this bounding box and not on the edge.
         */
        public isVec2InsideNotEdge(vec2 : Vector2) : boolean {
            return !(vec2.y < this.mWrappedNode.mPosition.y) &&
                !(vec2.y > this.mWrappedNode.mPosition.y + this.mWrappedNode.mSize.y) &&
                !(vec2.x > this.mWrappedNode.mPosition.x + this.mWrappedNode.mSize.x || vec2.x < this.mWrappedNode.mPosition.x);
        }

        /**
         * Check if a 2D point is inside of the bounding box, but doesn't include the edge of the bounding box.
         * 
         * @param x X value.
         * @param y Y Value.
         * @returns True if coordinate is inside this bounding box and not on the edge.
         */
        public isVec2InsideNotEdgeXY(x : number, y : number) : boolean {
            return !(y < this.mWrappedNode.mPosition.y) &&
                !(y > this.mWrappedNode.mPosition.y + this.mWrappedNode.mSize.y) &&
                !(x > this.mWrappedNode.mPosition.x + this.mWrappedNode.mSize.x || x < this.mWrappedNode.mPosition.x);
        }

        /**
         * Get wrapped node reference.
         * 
         * @returns Wrapped Node object.
         */
        public getWrappedNode() : T {
            return this.mWrappedNode;
        }

        /**
         * 
         * @returns 
         */
        public getRotationDegrees() : number {
            return this.mBindRotation ? this.mWrappedNode.getRotationDegrees() : this.mRotation;
        }

        public getRotationRadians() : number {
            return this.mBindRotation ? this.mWrappedNode.getRotationRadians() : this.mRotation;
        }

        /**
         * Get position Vector3 of wrapped node.
         * 
         * @returns Wrapped Node's mPosition member variable.
         */
        public getPosition() : Vector3 {
            return this.mWrappedNode.mPosition;
        }

        /**
         * Get size Vector2 of wrapped node.
         * 
         * @returns Wrapped Node's mSize member variable.
         */
        public getSize() : Vector2 {
            return this.mWrappedNode.mSize;
        }

        /**
         * 
         * 
         * @param geometry 
         * @returns 
         */
        public static generateFromGeometry(geometry : AGeometry2D) : BoundingBox2D<AGeometry2D> {
            return new BoundingBox2D(geometry)
        }

        // /**
        //  * Generate a bounding box around the array of 
        //  * 
        //  * @param geometry 
        //  */
        // public static generateFromGeometryArray(...geometry : AGeometry2D[]) : BoundingBox2D<AGeometry2D> {
        //     let rightBound : number = 0;
        //     let leftBound : number = 0;
        //     let topBound : number = 0;
        //     let bottomBound : number = 0;

        //     //TODO:: Make it so BoundingBox2D supports multiple AGeo objects inside the class.
        //     //       Maybe make it so the AGeo array is passed in and the constructor creates an "invisible" Quad that wraps all of the items.
        //     //      Whilst storing references to the "visible" AGeo objects.
        //     return new BoundingBox2D()
        // }
    }
}
