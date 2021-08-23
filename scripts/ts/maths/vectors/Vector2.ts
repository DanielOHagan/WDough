namespace WDOH {

    export class Vector2 implements IVector<Vector2> {

        private mX : number;
        private mY : number;

        public constructor(x : number, y : number) {
            this.mX = x;
            this.mY = y;
        }

        public get x() {
            return this.mX;
        }

        public set x(x : number) {
            this.mX = x;
        }

        public get y() {
            return this.mY;
        }

        public set y(y : number) {
            this.mY = y;
        }

        public addVec2(vec : Vector2) : Vector2 {
            this.mX += vec.x;
            this.mY += vec.y;

            return this;
        }

        public subtractVec2(vec : Vector2) : Vector2 {
            this.mX -= vec.x;
            this.mY -= vec.y;

            return this;
        }

        public mult(multiplier : number) : Vector2 {
            this.mX *= multiplier;
            this.mY *= multiplier;

            return this;
        }

        public divide(div : number) : Vector2 {
            this.mX /= div;
            this.mY /= div;

            return this;
        }

        public cross() : Vector2 {
            //TODO:: This

            return this;
        }

        public dot() : Vector2 {
            //TODO:: This

            return this;
        }
    }
}
