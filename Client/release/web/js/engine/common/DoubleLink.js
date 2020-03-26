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
    var DoubleLinkNode = /** @class */ (function (_super) {
        __extends(DoubleLinkNode, _super);
        function DoubleLinkNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DoubleLinkNode.prototype.IsAttach = function () {
            return this._dl != null;
        };
        DoubleLinkNode.prototype.Attach = function (dl) {
            if (dl != null)
                dl.PushBack(this);
        };
        DoubleLinkNode.prototype.Detach = function () {
            if (this._dl != null)
                this._dl.Remove(this);
            this._dl = null;
        };
        DoubleLinkNode.prototype.Pre = function () {
            return this._pre;
        };
        DoubleLinkNode.prototype.Next = function () {
            return this._next;
        };
        DoubleLinkNode.prototype.Dispose = function () {
            if (_super.prototype.IsDisposed.call(this))
                return;
            this.Detach();
        };
        return DoubleLinkNode;
    }(H52D_Framework.Base));
    H52D_Framework.DoubleLinkNode = DoubleLinkNode;
    //+-------------------------------------------------------------------------------------------------------------------------------------------------------------
    var DoubleLink = /** @class */ (function () {
        function DoubleLink() {
            this._root = new DoubleLinkNode();
            this._bridge = new DoubleLinkNode();
        }
        DoubleLink.prototype.IsEmpty = function () {
            return this._root._next == null;
        };
        DoubleLink.prototype.Next = function (node) {
            node = (node == null) ? this._root._next : (((node.IsAttach()) ? node._next : this._bridge._next));
            var ret = node != null;
            if (ret) {
                this._bridge._pre = node._pre;
                this._bridge._next = node._next;
            }
            return ret;
        };
        DoubleLink.prototype.Pre = function (node) {
            node = (node == null) ? this._root._pre : (((node.IsAttach()) ? node._pre : this._bridge._pre));
            var ret = node != null;
            if (ret) {
                this._bridge._pre = node._pre;
                this._bridge._next = node._next;
            }
            return ret;
        };
        DoubleLink.prototype.GetHead = function () {
            return this._root._next;
        };
        DoubleLink.prototype.GetTail = function () {
            return this._root._pre;
        };
        DoubleLink.prototype.PushBack = function (node) {
            node.Detach();
            node._dl = this;
            var pre = this._root._pre != null ? this._root._pre : this._root;
            this._root._pre = node;
            this._Link(pre, node);
        };
        DoubleLink.prototype.PushFront = function (node) {
            node.Detach();
            node._dl = this;
            var next = this._root._next != null ? this._root._next : this._root;
            this._root._next = node;
            this._Link(node, next);
        };
        DoubleLink.prototype.Remove = function (node) {
            if (node == null || !node.IsAttach())
                return;
            var pre = node._pre != null ? node._pre : this._root;
            var next = node._next != null ? node._next : this._root;
            this._Link(pre, next);
            node._dl = null;
        };
        DoubleLink.prototype.Clear = function () {
            var node = null;
            while (this.Next(node)) {
                this.Remove(node);
            }
        };
        DoubleLink.prototype._Link = function (pre, next) {
            pre._next = next;
            next._pre = pre;
        };
        return DoubleLink;
    }());
    H52D_Framework.DoubleLink = DoubleLink;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DoubleLink.js.map