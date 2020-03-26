/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class HeroHandBookView extends ui.heroList.HeroHandBookViewUI {
		constructor(buf) {
			super();

			this.ViewInit();
		}

		private _child: any;
		private ViewInit() {
			this.ViewEvent();
			this.single_name.text = GetInfoAttr.Instance.GetText(5025);
			this.most_name.text = GetInfoAttr.Instance.GetText(5026);
			this.UpdateRedPoint();
			Tick.Loop(100, this, this.UpdateRedPoint);
			HeroHandbookManager.Instance.IsTrue = true;
		}

		private ViewEvent() {
			this.HeroHand_single.on(Laya.Event.CLICK, this, this.Btnclick_hand, [HeroHandbookManager.Instance.ViewName[1]]);
			this.HeroHand_most.on(Laya.Event.CLICK, this, this.Btnclick_hand, [HeroHandbookManager.Instance.ViewName[2]]);
			this.Btnclick_hand(HeroHandbookManager.Instance.ViewName[1]);
			Event.RegistEvent("reshhandviewred", Laya.Handler.create(this, this.UpdateRedPoint));
			Event.DispatchEvent("ShowMaxBtn", [true]);
		}

		private Btnclick_hand(child: any) {
			this._child = child;
			let ShowView = Laya.Handler.create(this, () => {
				if (child == HeroHandbookManager.Instance.ViewName[1]) {
					this.single_bg.bgColor = "#4f445c";
					this.single_name.color = "#ced0d6"
					this.most_bg.bgColor = "#443e4c"
					this.most_name.color = "#a9b3cd";
				} else {
					this.single_bg.bgColor = "#443e4c";
					this.single_name.color = "#a9b3cd"
					this.most_bg.bgColor = "#4f445c"
					this.most_name.color = "#ced0d6";
				}
				UIManager.Instance.CreateUI(child, [this, this],
					Laya.Handler.create(this, (view) => {
						if (this.destroyed) {
							view.destroy(true);
						}
						else {
							if (this.ChildBox._childs[0]) {
								this.ChildBox._childs[0].OnDestroy();
							}
							this.ChildBox.destroyChildren();
							this.ChildBox.addChild(view);
						}
					}));
			})
			ShowView.run();
		}

		private UpdateRedPoint() {
			HeroHandbookManager.Instance.Red_Show();
			this.Single_red.visible = HeroHandbookManager.Instance.HandSingleShow;
			this.Most_red.visible = HeroHandbookManager.Instance.HandMostShow;
		}

		private OnDestroy() {
			this.offAll();
			if (this.ChildBox._childs[0]) {
				this.ChildBox._childs[0].OnDestroy();
			}
			this.ChildBox.destroyChildren();
			Event.RemoveEvent("reshhandviewred", Laya.Handler.create(this, this.UpdateRedPoint))
		}
	}
}