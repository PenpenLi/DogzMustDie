module H52D_Framework {

    class AstarRoundNode {
        node: AstarNode;
        cost: number;
    }

    class KCell {
        nNavMeshType: NavMeshType = NavMeshType.NavMesh_None; //byte
        nX: number = 0;
        nY: number = 0;
        nHeight: number = 0; //short

        public Clear(): void {
            this.nNavMeshType = NavMeshType.NavMesh_None;
            this.nX = 0;
            this.nY = 0;
            this.nHeight = 0;
        }
    }

    class AstarNode extends DoubleLinkNode<AstarNode>
    {
        public G: number;
        public H: number;
        public F: number;
        public cell: KCell = new KCell();
        public parent: AstarNode;
        public roundNodes: Array<AstarRoundNode> = new Array<AstarRoundNode>();
        public state: AstarNodeState = AstarNodeState.NONE;
        public get isOpen(): boolean { return this.state == AstarNodeState.OPEN; }
        public get isClose(): boolean { return this.state == AstarNodeState.CLOSE; }
        public get isBlock(): boolean { return this.cell.nNavMeshType <= NavMeshType.NavMesh_Empty; }

        public static Distance(from: AstarNode, to: AstarNode): number {
            let deltaX: number = from.cell.nX - to.cell.nX;
            let deltaY: number = from.cell.nY - to.cell.nY;
            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        public Clear(): void {
            this.G = 0;
            //this.cell.Clear();
            this.parent = null;
            this.state = AstarNodeState.NONE;
        }
    }

    class MinHeap {
        public get isEmpty() { return this.size == 0; }
        public size: number = 0;
        private _datas: Array<AstarNode>;

        constructor(size: number) {
            this._datas = new Array<AstarNode>(size);
        }

        public Push(kNode: AstarNode): void {
            if (this.size < this._datas.length - 1) {
                ++this.size;
                this._datas[this.size] = kNode;
                let index: number = this.size;
                while (index > 1) {
                    let parentIndex: number = this._GetParent(index);
                    if (this._datas[parentIndex].F > this._datas[index].F) {
                        let temp: AstarNode = this._datas[index];
                        this._datas[index] = this._datas[parentIndex];
                        this._datas[parentIndex] = temp;
                        index = parentIndex;
                    }
                    else {
                        break;
                    }
                }
            }
        }

        public Pop(): AstarNode {
            if (this.size > 0) {
                let temp: AstarNode = this._datas[1];
                this._datas[1] = this._datas[this.size];
                this._datas[this.size] = temp;
                --this.size;
                this._Siftdown(1);
                return this._datas[this.size + 1];
            }
            else {
                return null;
            }
        }

        public Clear(): void {
            this.size = 0;
        }

        private _GetLeft(idx: number): number { return idx << 1; }//k*2
        private _GetRight(idx: number): number { return (idx << 1) + 1; }//k*2+1
        private _GetParent(idx: number): number { return (idx >> 1); }//k/2
        private _Siftdown(index: number): void {
            let indexMod: number = index;
            let left: number = this._GetLeft(indexMod);
            while (left <= this.size) {
                let t: number = left;//int t= pos<<1; 
                let right: number = this._GetRight(indexMod);
                if (right <= this.size && this._datas[right].F < this._datas[t].F) {
                    t = right;
                }
                if (this._datas[t].F < this._datas[indexMod].F) {
                    let temp: AstarNode = this._datas[t];
                    this._datas[t] = this._datas[indexMod];
                    this._datas[indexMod] = temp;
                    indexMod = t;
                    left = this._GetLeft(indexMod);
                }
                else {
                    break;
                }
            }
        }
    }

    class DestChecker {
        public IsDest(step: AstarNode): boolean {
            return (AstarNode.Distance(step, this.dest) < this.diff);
        }
        public dest: AstarNode;
        public diff: number;
    }

    class Astar {
        public nodeCnt: number;
        public maxNodeCnt: number;
        public destChecker: DestChecker;

        private _nodeCnt: number;
        private _maxNodeCnt: number = 10000;
        private _startNode: AstarNode;
        private _destNode: AstarNode;
        private _currentNode: AstarNode;
        private _bestNode: AstarNode;
        private _openHeap: MinHeap;
        private _openList: Array<AstarNode> = new Array<AstarNode>();
        private _closeList: Array<AstarNode> = new Array<AstarNode>();

        constructor(heapSize: number) {
            this._openHeap = new MinHeap(heapSize);
        }

        public Search(src: AstarNode, dest: AstarNode): boolean {
            src.G = 0;
            src.H = AstarNode.Distance(src, dest);
            src.F = src.G + src.H;
            //
            this._startNode = src;
            this._bestNode = src;
            this._startNode.Clear();
            this._destNode = dest;
            //
            this._nodeCnt = 0;
            //
            this._AddToOpen(src);
            //
            while (this._openHeap.size > 0) {
                this._currentNode = this._openHeap.Pop();
                if (this.destChecker.IsDest(this._currentNode)) { //是否目标节点
                    this._bestNode = this._currentNode;
                    return true;
                }
                if (this._currentNode.H < this._bestNode.H) { //当前节点代价小
                    this._bestNode = this._currentNode;
                }
                ++this._nodeCnt;
                if (this._nodeCnt > this._maxNodeCnt) { //超过最大节点数量
                    return false;
                }
                this._ComputeNode(this._currentNode);
                this._currentNode.Detach(); //从开放列表中移除
                this._AddToClose(this._currentNode); //加入到关闭列表中
            }
            return false;
        }

        //生成路径
        public MakeRoute(nodes: Array<AstarNode>): void {
            let dir: number = 1 + (1 << 2);
            let next: AstarNode = this._bestNode;
            if (next == null) {
                return;
            }
            while (true) {
                let fromNode: AstarNode = next;
                next = next.parent;
                if (next != null) {
                    let toNode: AstarNode = next;
                    let deltaX: number = toNode.cell.nX - fromNode.cell.nX + 1;
                    let deltaY: number = (toNode.cell.nY - fromNode.cell.nY + 1) << 2;
                    let delta: number = deltaY + deltaX;
                    if (delta != dir) {
                        nodes.push(fromNode);
                        dir = delta;
                    }
                }
                else {
                    nodes.push(fromNode);
                    break;
                }
            }
            nodes.reverse();
        }

        public Reset(): void {
            while (true) {
                let node: AstarNode = this._openList.pop();
                if (node == null)
                    break;
                node.Clear();
            }
            //
            while (true) {
                let node: AstarNode = this._closeList.pop();
                if (node == null)
                    break;
                node.Clear();
            }
            //
            this._openHeap.Clear();
        }

        //计算节点
        private _ComputeNode(node: AstarNode): void {
            for (let idx: number = 0; idx < node.roundNodes.length; ++idx) {
                let roundNode: AstarRoundNode = node.roundNodes[idx];
                let childNode: AstarNode = roundNode.node;
                if (childNode.isClose)
                    continue;

                let newG: number = roundNode.cost + node.G;
                if (childNode.isOpen) { //如果是开放节点,判断G值大小
                    if (childNode.G > newG) {
                        childNode.G = newG;
                        childNode.F = childNode.G + childNode.H;
                        childNode.parent = node;
                    }
                }
                else {
                    childNode.G = newG;
                    childNode.H = AstarNode.Distance(childNode, this._destNode);
                    childNode.F = childNode.G + childNode.H;
                    childNode.parent = node;
                    this._AddToOpen(childNode);
                }
            }
        }

        private _AddToOpen(node: AstarNode): void {
            this._openList.push(node);
            node.state = AstarNodeState.OPEN;
            this._openHeap.Push(node);
        }

        private _AddToClose(node: AstarNode): void {
            node.state = AstarNodeState.CLOSE;
            this._closeList.push(node);
        }
    }

    export class Navigator {
        public get sizeX(): number { return this._sizeX; };
        public get sizeY(): number { return this._sizeY; };
        private _sizeX: number;
        private _sizeY: number;
        private _nodes: Array<AstarNode>;
        private _astar: Astar;

        constructor(bytes: Uint8Array) {
            this._astar = new Astar(1024);
            this._astar.destChecker = new DestChecker();
            this._astar.maxNodeCnt = 1024;

            let reader: Laya.Byte = new Laya.Byte(bytes);
            reader.pos = 0;
            this._sizeX = reader.getInt32();
            this._sizeY = reader.getInt32();

            this._InitNodes(this._sizeX + 1, this._sizeY + 1);
            for (let xIdx = 0; xIdx < this._sizeX; ++xIdx) {
                for (let yIdx = 0; yIdx < this._sizeY; ++yIdx) {
                    this._nodes[xIdx + yIdx * this._sizeX].cell.nNavMeshType = reader.getUint8();
                }
            }

            for (let xIdx = 1; xIdx < this._sizeX; ++xIdx) {
                for (let yIdx = 1; yIdx < this._sizeY; ++yIdx) {
                    this._Fresh(xIdx, yIdx);
                }
            }
        }

        public Search(srcX: number, srcY: number, destX: number, destY: number, fDiff: number = 0): Array<Laya.Vector3> {
            if ((srcX < this._sizeX && srcY < this._sizeY) == false || (destX < this._sizeX && destY < this._sizeY) == false) {
                return null;
            }

            let route: Array<Laya.Vector3> = new Array<Laya.Vector3>();
            let nodePool: Array<AstarNode> = new Array<AstarNode>();

            let srcNode: AstarNode = this._GetRoundActiveAstarNode(srcX, srcY, 100);
            let destNode: AstarNode = this._nodes[destX + destY * this._sizeX];

            // 如果一条直线可以直接过去，就不做寻路了
            if (!this._Pick(srcNode.cell.nX, srcNode.cell.nY, destX, destY, true)) {
                // 添加两个寻路点
                route.push(new Laya.Vector3(-srcNode.cell.nX, srcNode.cell.nHeight, srcNode.cell.nY));
                route.push(new Laya.Vector3(-destX, destNode.cell.nHeight, destY));
                return route;
            }

            this._astar.destChecker.dest = destNode;
            this._astar.destChecker.diff = fDiff;
            this._astar.Search(srcNode, destNode);
            this._astar.MakeRoute(nodePool);
            this._astar.Reset();
            this._ClipRoute(nodePool, route);
            return route;
        }

        /**
         * @brief 获取是否是可掉落
         * @param i_nX x点
         * @param i_nY y点
         * @return boolean (是否可掉落)
         */
        public GetPointAble(i_nX: number, i_nY: number): boolean {
            let destNode: AstarNode = this._nodes[i_nX + i_nY * this._sizeX];
            if (!destNode)
                return false
            else
                return (destNode.cell.nNavMeshType == NavMeshType.NavMesh_Empty);
        }

        //-------------------------------------------------------------------------------------------------------------    
        private _InitNodes(sizeX: number, sizeY: number) {
            let cnt: number = sizeX * sizeY;
            this._nodes = new Array<AstarNode>(cnt);

            for (let xIdx = 0; xIdx < sizeX; ++xIdx) {
                for (let yIdx = 0; yIdx < sizeY; ++yIdx) {
                    let node: AstarNode = new AstarNode();
                    node.cell.nNavMeshType = NavMeshType.NavMesh_Empty;
                    node.cell.nX = xIdx;
                    node.cell.nY = yIdx;
                    node.cell.nHeight = 0;
                    this._nodes[xIdx + yIdx * this._sizeX] = node;
                }
            }
        }

        private _Fresh(x: number, y: number): void {
            let curNode: AstarNode = this._nodes[x + y * this._sizeX];
            if (curNode.isBlock)
                return;

            for (let xIdx = x - 1; xIdx <= x + 1; ++xIdx) {
                for (let yIdx = y - 1; yIdx <= y + 1; ++yIdx) {
                    if (xIdx == x && yIdx == y)
                        continue;

                    if (x == 9) {
                        let i = 0;
                        i++;
                    }

                    let nextNode: AstarNode = this._nodes[xIdx + yIdx * this._sizeX];
                    if (!nextNode.isBlock) {
                        let roundNode: AstarRoundNode = new AstarRoundNode();
                        roundNode.node = nextNode;
                        //
                        let deltaX: number = x - xIdx;
                        let deltaY: number = y - yIdx;
                        roundNode.cost = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        curNode.roundNodes.push(roundNode);
                    }
                }
            }
        }

        private _GetRoundActiveAstarNode(iRootX: number, iRootY: number, iRange: number): AstarNode {
            let activeNode: AstarNode = this._nodes[iRootX + iRootY * this._sizeX];
            if (!activeNode.isBlock)
                return activeNode;

            for (let iRangeIdx: number = 1; iRangeIdx < iRange; ++iRangeIdx) {
                // iSrcX - iRangeIdx
                for (let iIdx: number = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    let iX: number = iRootX - iRangeIdx;
                    let iY: number = iRootY + iIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
                // iSrcX + iRangeIdx
                for (let iIdx: number = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    let iX: number = iRootX + iRangeIdx;
                    let iY: number = iRootY + iIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
                // iSrcY - iRangeIdx
                for (let iIdx = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    let iX: number = iRootX + iIdx;
                    let iY: number = iRootY - iRangeIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
                // iSrcY + iRangeIdx
                for (let iIdx = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    let iX: number = iRootX + iIdx;
                    let iY: number = iRootY + iRangeIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
            }
            return null;
        }

        private _PickXNegative(fromX: number, fromY: number, destX: number, destY: number, block: boolean): boolean {
            let deltaX: number = destX - fromX;
            let deltaY: number = destY - fromY;

            let fromCenterX: number = fromX + 0.5;
            let fromCenterY: number = fromY + 0.5;

            let fDeltaX: number = -1;
            let fDeltaY: number = deltaY / Math.abs(deltaX);

            let pickX: number = fromCenterX;
            let pickY: number = fromCenterY;

            for (let idx: number = fromX; idx > destX; --idx) {
                pickX += fDeltaX;
                pickY += fDeltaY;

                let newCellX: number = Math.floor(pickX);
                let newCellY: number = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }

            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;

            return false;
        }

        private _PickXPositive(fromX: number, fromY: number, destX: number, destY: number, block: boolean): boolean {
            let deltaX: number = destX - fromX;
            let deltaY: number = destY - fromY;

            let fromCenterX: number = fromX + 0.5;
            let fromCenterY: number = fromY + 0.5;

            let fDeltaX: number = 1;
            let fDeltaY: number = deltaY / Math.abs(deltaX);

            let pickX: number = fromCenterX;
            let pickY: number = fromCenterY;

            for (let idx: number = fromX; idx < destX; ++idx) {
                pickX += fDeltaX;
                pickY += fDeltaY;

                let newCellX: number = Math.floor(pickX);
                let newCellY: number = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }

            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;

            return false;
        }

        private _PickYNegative(fromX: number, fromY: number, destX: number, destY: number, block: boolean): boolean {
            let deltaX: number = destX - fromX;
            let deltaY: number = destY - fromY;

            let fromCenterX: number = fromX + 0.5;
            let fromCenterY: number = fromY + 0.5;

            let fDeltaX: number = deltaX / Math.abs(deltaY);
            let fDeltaY: number = -1;

            let pickX: number = fromCenterX;
            let pickY: number = fromCenterY;

            for (let idy: number = fromY; idy > destY; --idy) {
                pickX += fDeltaX;
                pickY += fDeltaY;

                let newCellX: number = Math.floor(pickX);
                let newCellY: number = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }
            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;

            return false;
        }

        private _PickYPositive(fromX: number, fromY: number, destX: number, destY: number, block: boolean): boolean {
            let deltaX: number = destX - fromX;
            let deltaY: number = destY - fromY;

            let fromCenterX: number = fromX + 0.5;
            let fromCenterY: number = fromY + 0.5;

            let fDeltaX: number = deltaX / Math.abs(deltaY);
            let fDeltaY: number = 1;

            let pickX: number = fromCenterX;
            let pickY: number = fromCenterY;

            for (let idy: number = fromY; idy < destY; ++idy) {
                pickX += fDeltaX;
                pickY += fDeltaY;

                let newCellX: number = Math.floor(pickX);
                let newCellY: number = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }
            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;

            return false;
        }

        private _Pick(fromX: number, fromY: number, destX: number, destY: number, block: boolean): boolean {
            let deltaX: number = destX - fromX;
            let deltaY: number = destY - fromY;
            if (deltaX == 0 && deltaY == 0)
                return false;

            let absDeltaX: number = Math.abs(deltaX);
            let absDeltaY: number = Math.abs(deltaY);
            if (absDeltaX >= absDeltaY) {
                if (deltaX < 0) {
                    return this._PickXNegative(fromX, fromY, destX, destY, block);
                }
                else {
                    return this._PickXPositive(fromX, fromY, destX, destY, block);
                }
            }
            else {
                if (deltaY < 0) {
                    return this._PickYNegative(fromX, fromY, destX, destY, block);
                }
                else {
                    return this._PickYPositive(fromX, fromY, destX, destY, block);
                }
            }
        }

        private _ClipRoute(complex: Array<AstarNode>, simple: Array<Laya.Vector3>): void {
            if (complex.length <= 2) {
                for (let idx: number = 0; idx < complex.length; ++idx) {
                    let pre: AstarNode = complex[idx];
                    simple.push(new Laya.Vector3(-pre.cell.nX, pre.cell.nHeight, pre.cell.nY));
                }
                return;
            }
            let from: AstarNode = complex[0];
            simple.push(new Laya.Vector3(-from.cell.nX, from.cell.nHeight, from.cell.nY));
            for (let idx: number = 1; idx < complex.length; ++idx) {
                let pre: AstarNode = complex[idx - 1];
                let current: AstarNode = complex[idx];
                if (this._Pick(from.cell.nX, from.cell.nY, current.cell.nX, current.cell.nY, true)) {
                    simple.push(new Laya.Vector3(-pre.cell.nX, pre.cell.nHeight, pre.cell.nY));
                    from = pre;
                }
            }
            let back: AstarNode = complex[complex.length - 1];
            simple.push(new Laya.Vector3(-back.cell.nX, back.cell.nHeight, back.cell.nY));
            /*for (let idx : number = 0; idx < complex.length; ++idx)
            {
                let pre : AstarNode = complex[idx];
                simple.push(new Laya.Vector3(-pre.cell.nX, pre.cell.nHeight, pre.cell.nY));
            }*/
        }
    }
}