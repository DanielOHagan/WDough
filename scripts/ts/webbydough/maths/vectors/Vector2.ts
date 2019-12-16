namespace wDOH {

    export class Vector2 {

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

        public addVec2(vec : Vector2) : void {
            this.mX += vec.x;
            this.mY += vec.y;
        }

        public subtractVec2(vec : Vector2) : void {
            this.mX -= vec.x;
            this.mY -= vec.y;
        }

        public cross() : void {
            //TODO:: This

        }

        public dot() : void {
            //TODO:: This
            
        }
    }
}