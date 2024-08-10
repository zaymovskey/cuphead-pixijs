import { BaseView, IHitBox } from '@/entities/BaseView.ts';
import { Graphics } from 'pixi.js';

export class HeroView extends BaseView {
  hitBoxWidth: number = 80;
  hitBoxHeight: number = 100;

  gunWidth: number = 70;
  gunHeight: number = 20;

  hitBox: IHitBox = {
    x: this.x,
    y: this.y,
    width: this.hitBoxWidth,
    height: this.hitBoxHeight,
  };

  constructor() {
    super();

    const hero = this.getImage();

    this.addChild(hero);

    hero.pivot.x = 40;
    hero.x = 40;

    const heroPivot = new Graphics()
      .circle(hero.pivot.x, hero.pivot.y, 2)
      .fill('red');

    hero.strokeStyle.width = 2;

    hero.addChild(heroPivot);
  }

  getImage(settings?: { shootAngle?: 0 | 45 | -45 | 90; tilt?: boolean }) {
    const hero = new Graphics()
      .rect(this.x, this.y, this.hitBoxWidth, this.hitBoxHeight)
      .stroke('#66b466');

    if (!settings) return hero;

    if (settings.shootAngle) {
      const gun = new Graphics()
        .rect(0, 0, this.gunWidth, this.gunHeight)
        .stroke('#66b466');

      gun.pivot.y = this.gunHeight / 2;
      gun.pivot.x = this.gunWidth / 4;

      gun.x = this.hitBoxWidth - this.hitBoxWidth / 7;
      gun.y = this.hitBoxHeight / 3;

      const gunPivot = new Graphics()
        .circle(gun.pivot.x, gun.pivot.y, 2)
        .fill('red');

      gun.addChild(gunPivot);
      hero.addChild(gun);

      gun.rotation = settings.shootAngle * (Math.PI / 180);
    }

    if (settings.tilt) {
      hero.skew.x = -0.1;
    }
    return hero;
  }
}
