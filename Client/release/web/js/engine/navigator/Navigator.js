var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    var AstarRoundNode = /** @class */ (function () {
        function AstarRoundNode() {
        }
        return AstarRoundNode;
    }());
    var KCell = /** @class */ (function () {
        function KCell() {
            this.nNavMeshType = NavMeshType.NavMesh_None; //byte
            this.nX = 0;
            this.nY = 0;
            this.nHeight = 0; //short
        }
        KCell.prototype.Clear = function () {
            this.nNavMeshType = NavMeshType.NavMesh_None;
            this.nX = 0;
            this.nY = 0;
            this.nHeight = 0;
        };
        return KCell;
    }());
    var AstarNode = /** @class */ (function (_super) {
        __extends(AstarNode, _super);
        function AstarNode() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cell = new KCell();
            _this.roundNodes = new Array();
            _this.state = AstarNodeState.NONE;
            return _this;
        }
        Object.defineProperty(AstarNode.prototype, "isOpen", {
            get: function () { return this.state == AstarNodeState.OPEN; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstarNode.prototype, "isClose", {
            get: function () { return this.state == AstarNodeState.CLOSE; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstarNode.prototype, "isBlock", {
            get: function () { return this.cell.nNavMeshType <= NavMeshType.NavMesh_Empty; },
            enumerable: true,
            configurable: true
        });
        AstarNode.Distance = function (from, to) {
            var deltaX = from.cell.nX - to.cell.nX;
            var deltaY = from.cell.nY - to.cell.nY;
            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        };
        AstarNode.prototype.Clear = function () {
            this.G = 0;
            //this.cell.Clear();
            this.parent = null;
            this.state = AstarNodeState.NONE;
        };
        return AstarNode;
    }(H52D_Framework.DoubleLinkNode));
    var MinHeap = /** @class */ (function () {
        function MinHeap(size) {
            this.size = 0;
            this._datas = new Array(size);
        }
        Object.defineProperty(MinHeap.prototype, "isEmpty", {
            get: function () { return this.size == 0; },
            enumerable: true,
            configurable: true
        });
        MinHeap.prototype.Push = function (kNode) {
            if (this.size < this._datas.length - 1) {
                ++this.size;
                this._datas[this.size] = kNode;
                var index = this.size;
                while (index > 1) {
                    var parentIndex = this._GetParent(index);
                    if (this._datas[parentIndex].F > this._datas[index].F) {
                        var temp = this._datas[index];
                        this._datas[index] = this._datas[parentIndex];
                        this._datas[parentIndex] = temp;
                        index = parentIndex;
                    }
                    else {
                        break;
                    }
                }
            }
        };
        MinHeap.prototype.Pop = function () {
            if (this.size > 0) {
                var temp = this._datas[1];
                this._datas[1] = this._datas[this.size];
                this._datas[this.size] = temp;
                --this.size;
                this._Siftdown(1);
                return this._datas[this.size + 1];
            }
            else {
                return null;
            }
        };
        MinHeap.prototype.Clear = function () {
            this.size = 0;
        };
        MinHeap.prototype._GetLeft = function (idx) { return idx << 1; }; //k*2
        MinHeap.prototype._GetRight = function (idx) { return (idx << 1) + 1; }; //k*2+1
        MinHeap.prototype._GetParent = function (idx) { return (idx >> 1); }; //k/2
        MinHeap.prototype._Siftdown = function (index) {
            var indexMod = index;
            var left = this._GetLeft(indexMod);
            while (left <= this.size) {
                var t = left; //int t= pos<<1; 
                var right = this._GetRight(indexMod);
                if (right <= this.size && this._datas[right].F < this._datas[t].F) {
                    t = right;
                }
                if (this._datas[t].F < this._datas[indexMod].F) {
                    var temp = this._datas[t];
                    this._datas[t] = this._datas[indexMod];
                    this._datas[indexMod] = temp;
                    indexMod = t;
                    left = this._GetLeft(indexMod);
                }
                else {
                    break;
                }
            }
        };
        return MinHeap;
    }());
    var DestChecker = /** @class */ (function () {
        function DestChecker() {
        }
        DestChecker.prototype.IsDest = function (step) {
            return (AstarNode.Distance(step, this.dest) < this.diff);
        };
        return DestChecker;
    }());
    var Astar = /** @class */ (function () {
        function Astar(heapSize) {
            this._maxNodeCnt = 10000;
            this._openList = new Array();
            this._closeList = new Array();
            this._openHeap = new MinHeap(heapSize);
        }
        Astar.prototype.Search = function (src, dest) {
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
        };
        //生成路径
        Astar.prototype.MakeRoute = function (nodes) {
            var dir = 1 + (1 << 2);
            var next = this._bestNode;
            if (next == null) {
                return;
            }
            while (true) {
                var fromNode = next;
                next = next.parent;
                if (next != null) {
                    var toNode = next;
                    var deltaX = toNode.cell.nX - fromNode.cell.nX + 1;
                    var deltaY = (toNode.cell.nY - fromNode.cell.nY + 1) << 2;
                    var delta = deltaY + deltaX;
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
        };
        Astar.prototype.Reset = function () {
            while (true) {
                var node = this._openList.pop();
                if (node == null)
                    break;
                node.Clear();
            }
            //
            while (true) {
                var node = this._closeList.pop();
                if (node == null)
                    break;
                node.Clear();
            }
            //
            this._openHeap.Clear();
        };
        //计算节点
        Astar.prototype._ComputeNode = function (node) {
            for (var idx = 0; idx < node.roundNodes.length; ++idx) {
                var roundNode = node.roundNodes[idx];
                var childNode = roundNode.node;
                if (childNode.isClose)
                    continue;
                var newG = roundNode.cost + node.G;
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
        };
        Astar.prototype._AddToOpen = function (node) {
            this._openList.push(node);
            node.state = AstarNodeState.OPEN;
            this._openHeap.Push(node);
        };
        Astar.prototype._AddToClose = function (node) {
            node.state = AstarNodeState.CLOSE;
            this._closeList.push(node);
        };
        return Astar;
    }());
    var Navigator = /** @class */ (function () {
        function Navigator(bytes) {
            this._astar = new Astar(1024);
            this._astar.destChecker = new DestChecker();
            this._astar.maxNodeCnt = 1024;
            var reader = new Laya.Byte(bytes);
            reader.pos = 0;
            this._sizeX = reader.getInt32();
            this._sizeY = reader.getInt32();
            this._InitNodes(this._sizeX + 1, this._sizeY + 1);
            for (var xIdx = 0; xIdx < this._sizeX; ++xIdx) {
                for (var yIdx = 0; yIdx < this._sizeY; ++yIdx) {
                    this._nodes[xIdx + yIdx * this._sizeX].cell.nNavMeshType = reader.getUint8();
                }
            }
            for (var xIdx = 1; xIdx < this._sizeX; ++xIdx) {
                for (var yIdx = 1; yIdx < this._sizeY; ++yIdx) {
                    this._Fresh(xIdx, yIdx);
                }
            }
        }
        Object.defineProperty(Navigator.prototype, "sizeX", {
            get: function () { return this._sizeX; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Navigator.prototype, "sizeY", {
            get: function () { return this._sizeY; },
            enumerable: true,
            configurable: true
        });
        ;
        Navigator.prototype.Search = function (srcX, srcY, destX, destY, fDiff) {
            if (fDiff === void 0) { fDiff = 0; }
            if ((srcX < this._sizeX && srcY < this._sizeY) == false || (destX < this._sizeX && destY < this._sizeY) == false) {
                return null;
            }
            var route = new Array();
            var nodePool = new Array();
            var srcNode = this._GetRoundActiveAstarNode(srcX, srcY, 100);
            var destNode = this._nodes[destX + destY * this._sizeX];
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
        };
        /**
         * @brief 获取是否是可掉落
         * @param i_nX x点
         * @param i_nY y点
         * @return boolean (是否可掉落)
         */
        Navigator.prototype.GetPointAble = function (i_nX, i_nY) {
            var destNode = this._nodes[i_nX + i_nY * this._sizeX];
            if (!destNode)
                return false;
            else
                return (destNode.cell.nNavMeshType == NavMeshType.NavMesh_Empty);
        };
        //-------------------------------------------------------------------------------------------------------------    
        Navigator.prototype._InitNodes = function (sizeX, sizeY) {
            var cnt = sizeX * sizeY;
            this._nodes = new Array(cnt);
            for (var xIdx = 0; xIdx < sizeX; ++xIdx) {
                for (var yIdx = 0; yIdx < sizeY; ++yIdx) {
                    var node = new AstarNode();
                    node.cell.nNavMeshType = NavMeshType.NavMesh_Empty;
                    node.cell.nX = xIdx;
                    node.cell.nY = yIdx;
                    node.cell.nHeight = 0;
                    this._nodes[xIdx + yIdx * this._sizeX] = node;
                }
            }
        };
        Navigator.prototype._Fresh = function (x, y) {
            var curNode = this._nodes[x + y * this._sizeX];
            if (curNode.isBlock)
                return;
            for (var xIdx = x - 1; xIdx <= x + 1; ++xIdx) {
                for (var yIdx = y - 1; yIdx <= y + 1; ++yIdx) {
                    if (xIdx == x && yIdx == y)
                        continue;
                    if (x == 9) {
                        var i = 0;
                        i++;
                    }
                    var nextNode = this._nodes[xIdx + yIdx * this._sizeX];
                    if (!nextNode.isBlock) {
                        var roundNode = new AstarRoundNode();
                        roundNode.node = nextNode;
                        //
                        var deltaX = x - xIdx;
                        var deltaY = y - yIdx;
                        roundNode.cost = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        curNode.roundNodes.push(roundNode);
                    }
                }
            }
        };
        Navigator.prototype._GetRoundActiveAstarNode = function (iRootX, iRootY, iRange) {
            var activeNode = this._nodes[iRootX + iRootY * this._sizeX];
            if (!activeNode.isBlock)
                return activeNode;
            for (var iRangeIdx = 1; iRangeIdx < iRange; ++iRangeIdx) {
                // iSrcX - iRangeIdx
                for (var iIdx = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    var iX = iRootX - iRangeIdx;
                    var iY = iRootY + iIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
                // iSrcX + iRangeIdx
                for (var iIdx = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    var iX = iRootX + iRangeIdx;
                    var iY = iRootY + iIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
                // iSrcY - iRangeIdx
                for (var iIdx = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    var iX = iRootX + iIdx;
                    var iY = iRootY - iRangeIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
                // iSrcY + iRangeIdx
                for (var iIdx = -iRangeIdx; iIdx <= iRangeIdx; ++iIdx) {
                    var iX = iRootX + iIdx;
                    var iY = iRootY + iRangeIdx;
                    if (iX >= 0 && iX < this._sizeX && iY >= 0 && iY < this._sizeY) {
                        activeNode = this._nodes[iX + iY * this._sizeX];
                        if (!activeNode.isBlock)
                            return activeNode;
                    }
                }
            }
            return null;
        };
        Navigator.prototype._PickXNegative = function (fromX, fromY, destX, destY, block) {
            var deltaX = destX - fromX;
            var deltaY = destY - fromY;
            var fromCenterX = fromX + 0.5;
            var fromCenterY = fromY + 0.5;
            var fDeltaX = -1;
            var fDeltaY = deltaY / Math.abs(deltaX);
            var pickX = fromCenterX;
            var pickY = fromCenterY;
            for (var idx = fromX; idx > destX; --idx) {
                pickX += fDeltaX;
                pickY += fDeltaY;
                var newCellX = Math.floor(pickX);
                var newCellY = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }
            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;
            return false;
        };
        Navigator.prototype._PickXPositive = function (fromX, fromY, destX, destY, block) {
            var deltaX = destX - fromX;
            var deltaY = destY - fromY;
            var fromCenterX = fromX + 0.5;
            var fromCenterY = fromY + 0.5;
            var fDeltaX = 1;
            var fDeltaY = deltaY / Math.abs(deltaX);
            var pickX = fromCenterX;
            var pickY = fromCenterY;
            for (var idx = fromX; idx < destX; ++idx) {
                pickX += fDeltaX;
                pickY += fDeltaY;
                var newCellX = Math.floor(pickX);
                var newCellY = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }
            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;
            return false;
        };
        Navigator.prototype._PickYNegative = function (fromX, fromY, destX, destY, block) {
            var deltaX = destX - fromX;
            var deltaY = destY - fromY;
            var fromCenterX = fromX + 0.5;
            var fromCenterY = fromY + 0.5;
            var fDeltaX = deltaX / Math.abs(deltaY);
            var fDeltaY = -1;
            var pickX = fromCenterX;
            var pickY = fromCenterY;
            for (var idy = fromY; idy > destY; --idy) {
                pickX += fDeltaX;
                pickY += fDeltaY;
                var newCellX = Math.floor(pickX);
                var newCellY = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }
            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;
            return false;
        };
        Navigator.prototype._PickYPositive = function (fromX, fromY, destX, destY, block) {
            var deltaX = destX - fromX;
            var deltaY = destY - fromY;
            var fromCenterX = fromX + 0.5;
            var fromCenterY = fromY + 0.5;
            var fDeltaX = deltaX / Math.abs(deltaY);
            var fDeltaY = 1;
            var pickX = fromCenterX;
            var pickY = fromCenterY;
            for (var idy = fromY; idy < destY; ++idy) {
                pickX += fDeltaX;
                pickY += fDeltaY;
                var newCellX = Math.floor(pickX);
                var newCellY = Math.floor(pickY);
                if (this._nodes[newCellX + newCellY * this._sizeX].isBlock == block)
                    return true;
            }
            if (this._nodes[destX + destY * this._sizeX].isBlock == block)
                return true;
            return false;
        };
        Navigator.prototype._Pick = function (fromX, fromY, destX, destY, block) {
            var deltaX = destX - fromX;
            var deltaY = destY - fromY;
            if (deltaX == 0 && deltaY == 0)
                return false;
            var absDeltaX = Math.abs(deltaX);
            var absDeltaY = Math.abs(deltaY);
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
        };
        Navigator.prototype._ClipRoute = function (complex, simple) {
            if (complex.length <= 2) {
                for (var idx = 0; idx < complex.length; ++idx) {
                    var pre = complex[idx];
                    simple.push(new Laya.Vector3(-pre.cell.nX, pre.cell.nHeight, pre.cell.nY));
                }
                return;
            }
            var from = complex[0];
            simple.push(new Laya.Vector3(-from.cell.nX, from.cell.nHeight, from.cell.nY));
            for (var idx = 1; idx < complex.length; ++idx) {
                var pre = complex[idx - 1];
                var current = complex[idx];
                if (this._Pick(from.cell.nX, from.cell.nY, current.cell.nX, current.cell.nY, true)) {
                    simple.push(new Laya.Vector3(-pre.cell.nX, pre.cell.nHeight, pre.cell.nY));
                    from = pre;
                }
            }
            var back = complex[complex.length - 1];
            simple.push(new Laya.Vector3(-back.cell.nX, back.cell.nHeight, back.cell.nY));
            /*for (let idx : number = 0; idx < complex.length; ++idx)
            {
                let pre : AstarNode = complex[idx];
                simple.push(new Laya.Vector3(-pre.cell.nX, pre.cell.nHeight, pre.cell.nY));
            }*/
        };
        return Navigator;
    }());
    H52D_Framework.Navigator = Navigator;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Navigator.js.map