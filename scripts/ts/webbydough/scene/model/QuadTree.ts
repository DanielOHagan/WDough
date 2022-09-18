namespace WDOH {

    export class QuadTree<T extends ISceneNode> {

        private static readonly LEVEL_MAX_OBJECT_COUNT : number = 100;
        private static readonly MAX_TREE_LEVEL : number = 10;
        private static readonly NEW_BRANCH_OBJECT_COUNT : number = 10;

        private static readonly NOT_IN_CHILD : number = -1;
        private static readonly TOP_RIGHT : number = 0;
        private static readonly TOP_LEFT : number = 1;
        private static readonly BOTTOM_LEFT : number = 2;
        private static readonly BOTTOM_RIGHT : number = 3;

        private readonly mLevel : number;
        private readonly mParentNode : QuadTree<T>;
        private mObjects : T[];
        private mBoundingBox2D : BoundingBox2D<Quad>;
        private mChildNodes : QuadTree<T>[] | null;

        public constructor(
            boundingBox : BoundingBox2D<Quad>,
            parentNode : QuadTree<T> | null,
            currentLevel : number = 0
        ) {
            this.mParentNode = parentNode === null ? this : parentNode;
            this.mLevel = currentLevel;
            this.mObjects = [];
            this.mBoundingBox2D = boundingBox;
            this.mChildNodes = null;
        }

        /**
         * Clear current level of objects and that of any child nodes.
         */
        public cleanUp() : void {
            this.mObjects.length = 0;

            if (this.mChildNodes !== null) {
                for (let node of this.mChildNodes) {
                    node.cleanUp();
                }
            }
        }

        /**
         * Create 4 child QuadTree nodes and assign a BoundingBox2D<Quad>.
         */
        private splitIntoNodes() : void {
            const pos : Vector3 = this.mBoundingBox2D.getWrappedNode().getPosition();
            const childWidth : number = this.mBoundingBox2D.getWrappedNode().getSize().x / 2;
            const childHeight : number = this.mBoundingBox2D.getWrappedNode().getSize().y / 2;

            this.mChildNodes = new Array<QuadTree<T>>(4);

            this.mChildNodes[QuadTree.TOP_RIGHT] = new QuadTree(
                new BoundingBox2D(
                    new Quad(
                        new Vector3(pos.x + childWidth, pos.y, 0.000001),
                        new Vector2(childWidth, childHeight),
                        new Vector4(
                            0.81960784313, /* (1 / 255) * 209 */
                            0.21960784313, /* (1 / 255) * 56  */
                            0.21960784313, /* (1 / 255) * 56  */
                            1
                        ),
                        0,
                        null
                    )
                ),
                this,
                this.mLevel + 1
            );
            this.mChildNodes[QuadTree.TOP_LEFT] = new QuadTree(
                new BoundingBox2D(
                    new Quad(
                        new Vector3(pos.x, pos.y, 0.000001),
                        new Vector2(childWidth, childHeight),
                        new Vector4(
                            0.11764705882, /* (1 / 255) * 30  */
                            0.76078431372, /* (1 / 255) * 194 */
                            0.10588235294, /* (1 / 255) * 27  */
                            1
                        ),
                        0,
                        null
                    )
                ),
                this,
                this.mLevel + 1
            );
            this.mChildNodes[QuadTree.BOTTOM_LEFT] = new QuadTree(
                new BoundingBox2D(
                    new Quad(
                        new Vector3(pos.x, pos.y + childHeight, 0.000001),
                        new Vector2(childWidth, childHeight),
                        new Vector4(
                            0.16470588235, /* (1 / 255) * 42  */
                            0.16470588235, /* (1 / 255) * 42  */
                            0.81960784313, /* (1 / 255) * 209 */
                            1
                        ),
                        0,
                        null
                    )
                ),
                this,
                this.mLevel + 1
            );
            this.mChildNodes[QuadTree.BOTTOM_RIGHT] = new QuadTree(
                new BoundingBox2D(
                    new Quad(
                        new Vector3(pos.x + childWidth, pos.y + childHeight, 0.000001),
                        new Vector2(childWidth, childHeight),
                        new Vector4(
                            0.56078431372, /* (1 / 255) * 143  */
                            0.55294117647, /* (1 / 255) * 141  */
                            0.55294117647, /* (1 / 255) * 141 */
                            1
                        ),
                        0,
                        null
                    )
                ),
                this,
                this.mLevel + 1,
            );
        }

        private sortObjectsIntoChildNodes() : void {
            let objectsCopy : T[] = Array.from(this.mObjects);
            this.mObjects = [];

            for (let object of objectsCopy) {
                this.add(object);
            }
        }

        /**
         * 
         * @param object The object to be added to the Quad Tree
         * @returns True if object added to Quad Tree, false if not. Only returns false if no space available in branch.
         */
        public add(object : T) : boolean {
            if (this.mChildNodes === null && this.mObjects.length < QuadTree.NEW_BRANCH_OBJECT_COUNT) {
                return this.tryAddObject(object);
            } else if (this.mChildNodes === null && this.mObjects.length >= QuadTree.NEW_BRANCH_OBJECT_COUNT) {
                const added : boolean = this.tryAddObject(object);

                if (added && this.mLevel < QuadTree.MAX_TREE_LEVEL) {
                    this.splitIntoNodes();
                    this.sortObjectsIntoChildNodes();
                }

                return added;
            } else if (this.mChildNodes !== null) {
                const index : number = this.getChildIndexByObject(object);

                if (index !== QuadTree.NOT_IN_CHILD) {
                    return this.mChildNodes[index].add(object);
                } else {
                    return this.tryAddObject(object);
                }
            }

            return false;
        }

        /**
         * Try to add object to current level's mObjects array.
         * 
         * @param object Object to add.
         * @returns True if current level has space for object and is added to array.
         */
        private tryAddObject(object : T) : boolean {
            return this.mObjects.length < QuadTree.LEVEL_MAX_OBJECT_COUNT ? this.mObjects.push(object) > 0 : false;
        }

        private getChildIndexByObject(object : T) : number {
            if (this.mChildNodes !== null) {
                let index : number = -1;

                for (let node of this.mChildNodes) {
                    if (node.mBoundingBox2D.encloses(BoundingBox2D.generateFromGeometry(object.getGeometry()))) {
                        return ++index;
                    }

                    index++;
                }
            }

            return QuadTree.NOT_IN_CHILD;
        }

        private getChildIndexByPoint(point : Vector2) : number {
            if (this.mChildNodes !== null) {
                let index : number = -1;

                for (let node of this.mChildNodes) {
                    if (node.mBoundingBox2D.isVec2Inside(point)) {
                        return ++index;
                    }

                    index++;
                }
            }

            return QuadTree.NOT_IN_CHILD;
        }

        /**
         * 
         * @param object 
         * @returns 
         */
        public retrieveAllInQuadByObject(object : T) : T[] {
            const index : number = this.getChildIndexByObject(object);
            let array : T[] = [];

            if (this.mChildNodes === null || index === QuadTree.NOT_IN_CHILD) {
                array.push(...this.mObjects);
                array.push(...this.getAllHigherLevelUnsortedObjects());
            } else {
                array.push(...this.mChildNodes[index].retrieveAllInQuadByObject(object));
            }

            return array;
        }

        /**
         * 
         * @param point 
         * @returns 
         */
        public retrieveAllInQuadByPoint(point : Vector2) : T[] {
            const index : number = this.getChildIndexByPoint(point);
            let array : T[] = [];

            if (this.mChildNodes === null || index === QuadTree.NOT_IN_CHILD) {
                array.push(...this.mObjects);
                array.push(...this.getAllHigherLevelUnsortedObjects());
            } else {
                array.push(...this.mChildNodes[index].retrieveAllInQuadByPoint(point));
            }

            return array;
        }

        /**
         * Get objects from higher level Tree nodes, on a direct path to the root,
         * that has not been sorted into a child node.
         * 
         * @returns Objects from parent nodes that have not been sorted into a child node.
         */
        public getAllHigherLevelUnsortedObjects() : T[] {
            let array : T[] = [];
            let node : QuadTree<T> = this.mParentNode;

            for (let i : number = this.mLevel; i > -1; i--) {
                array.push(...node.mObjects);
                node = node.mParentNode;
            }

            return array;
        }

        /**
         * Get all objects within the entire QuadTree.
         * Objects from this level are added first, then the objects of
         * first child node, if one exists, before adding objects from the
         * second child node.
         * 
         * @returns All objects in the entire QuadTree as an array.
         */
        public getAllObjectsInTree() : T[] {
            return this.getRootNode().getAllObjectsFromHere();
        }

        /**
         * Get all objects from this node and any children.
         * Objects from this node are added first, then the objects of the
         * first child node, if one exists, before adding objects from the
         * second child node.
         * 
         * @returns All objects from this node and all children.
         */
        public getAllObjectsFromHere() : T[] {
            let array : T[] = [];
            array.push(...this.mObjects);

            if (this.mChildNodes !== null) {
                for (let child of this.mChildNodes) {
                    array.push(...child.getAllObjectsFromHere())
                }
            }

            return array;
        }

        /**
         * 
         * @returns 
         */
        public getRootNode() : QuadTree<T> {
            let node : QuadTree<T> = this;

            while (!node.isRoot()) {
                node = node.mParentNode;
            }

            return node;
        }

        public isRoot() : boolean {
            return this.mLevel === 0;
        }

        public getParentNode() : QuadTree<T> {
            return this.mParentNode;
        }

        public getLevel() : number {
            return this.mLevel;
        }

        /**
         * DEBUG method, if this is commited in release then I forgot to remove it. Woop.s
         * Could have a large impact on performance and not suitable for use other than debugging.
         * 
         * @param querriedObject 
         * @returns 
         */
        public DEBUG_drawEndBranches() {
            if (this.mChildNodes !== null) {
                for (let quadTree of this.mChildNodes) {
                    quadTree.DEBUG_drawEndBranches();
                }
            } else {
                mApplication.getRenderer().render2D().drawQuad(this.mBoundingBox2D.getWrappedNode());
            }
        }

        /**
         * DEBUG method, if this is commited in release then I forgot to remove it. Woops.
         * Could have a large impact on performance and not suitable for use other than debugging.
         * 
         * @param querriedObject 
         * @returns 
         */
        public DEBUG_getLevelFromObject(querriedObject : T) : number {
            for (let object of this.mObjects) {
                if (object === querriedObject) {
                    return this.mLevel;
                }
            }

            if (this.mChildNodes !== null) {
                for (let child of this.mChildNodes) {
                    const response : number = child.DEBUG_getLevelFromObject(querriedObject);
                    if (response !== -1)
                        return response;
                }
            }

            return -1;
        }
    }
}
