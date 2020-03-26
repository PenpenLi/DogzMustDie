module H52D_Framework {
    export class DoubleLinkNode<T extends DoubleLinkNode<T>> extends H52D_Framework.Base {
        _pre: T;
        _next: T;
        _dl: DoubleLink<T>;

        public IsAttach(): boolean {
            return this._dl != null;
        }

        public Attach(dl: DoubleLink<T>): void {
            if (dl != null)
                dl.PushBack(this);
        }
        
        public Detach(): void {
            if (this._dl != null)
                this._dl.Remove(this);
            this._dl = null;
        }

        public Pre(): T {
            return this._pre;
        }

        public Next(): T {
            return this._next;
        }

        public Dispose(): void {
            if (super.IsDisposed())
                return;
            this.Detach();
        }
    }

    //+-------------------------------------------------------------------------------------------------------------------------------------------------------------

    export class DoubleLink<T extends DoubleLinkNode<T>>
    {
        _root: DoubleLinkNode<T> = new DoubleLinkNode<T>();
        _bridge: DoubleLinkNode<T> = new DoubleLinkNode<T>();

        public IsEmpty(): boolean {
            return this._root._next == null;
        }

        public Next(node: T): boolean {
            node = (node == null) ? this._root._next : (((node.IsAttach()) ? node._next : this._bridge._next));
            let ret: boolean = node != null;
            if (ret) {
                this._bridge._pre = node._pre;
                this._bridge._next = node._next;
            }
            return ret;
        }

        public Pre(node: T): boolean {
            node = (node == null) ? this._root._pre : (((node.IsAttach()) ? node._pre : this._bridge._pre));
            let ret: boolean = node != null;
            if (ret) {
                this._bridge._pre = node._pre;
                this._bridge._next = node._next;
            }
            return ret;
        }

        public GetHead(): T {
            return this._root._next;
        }

        public GetTail(): T {
            return this._root._pre;
        }

        public PushBack(node: DoubleLinkNode<T>): void {
            node.Detach();
            node._dl = this;
            let pre: DoubleLinkNode<T> = this._root._pre != null ? this._root._pre : this._root;
            this._root._pre = node as T;
            this._Link(pre, node);
        }

        public PushFront(node: DoubleLinkNode<T>): void {
            node.Detach();
            node._dl = this;
            let next: DoubleLinkNode<T> = this._root._next != null ? this._root._next : this._root;
            this._root._next = node as T;
            this._Link(node, next);
        }

        public Remove(node: DoubleLinkNode<T>): void {
            if (node == null || !node.IsAttach())
                return;

            let pre: DoubleLinkNode<T> = node._pre != null ? node._pre : this._root;
            let next: DoubleLinkNode<T> = node._next != null ? node._next : this._root;
            this._Link(pre, next);
            node._dl = null;
        }

        public Clear(): void {
            let node: T = null;
            while (this.Next(node)) {
                this.Remove(node);
            }
        }

        private _Link(pre: DoubleLinkNode<T>, next: DoubleLinkNode<T>): void {
            pre._next = next as T;
            next._pre = pre as T;
        }
    }
}