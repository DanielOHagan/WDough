namespace WDOH {

    export class Quad {
        public mPosition : Vector3; //Bottom Left of Quad
        public mSize : Vector2;
        public mColour : Vector4;
        //rotation

        public constructor(pos : Vector3, size : Vector2, colour : Vector4) {
            this.mPosition = pos;
            this.mSize = size;
            this.mColour = colour;
        }

        public isVec2Inside(vec2 : Vector2) : boolean {
            //TODO:: Shorten this to one return line
            let leftBound = this.mPosition.x;
            let rightBound = this.mPosition.x + this.mSize.x;
            let topBound = this.mPosition.y + this.mSize.y;
            let bottomBound = this.mPosition.y;

            if (vec2.x > rightBound || vec2.x < leftBound) return false;

            if (vec2.y < bottomBound || vec2.y > topBound) return false;

            return true;
        }
    }
}