/**
* 漂字类
* @author张振明
*/
module H52D_Framework {
	export class Floating {
		/**
		 * 漂字函数
		 * @param value 数字
		 * @param skinEnum  类型
		 * @param x 位置x
		 * @param y 位置y
		 * @param birthY y位置随机高度
		 */
		public static DamageText(value: string, skinEnum: SkinEnum, x: number, y: number, isCrit: boolean, birthY: number = 0): void {
			UIManager.Instance.InstanceUI("FloatView", [AvatarEffectRoot, value, skinEnum, x, y, isCrit, birthY]);
		}

		public static SkillNameText(name, x, y) {
			UIManager.Instance.InstanceUI("SkillNameView", [AvatarEffectRoot, name, x, y]);
		}

	}
}