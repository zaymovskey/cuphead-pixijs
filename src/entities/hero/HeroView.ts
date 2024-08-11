import { DEFAULT_STROKE_WIDTH } from '@/consts/global';
import { BaseView, IHitBox } from '@/entities/BaseView';
import { Graphics } from 'pixi.js';

export class HeroView extends BaseView {
  heroHitBoxWidth: number = 65;
  heroHitBoxHeight: number = 150;
  heroHitBoxColor: string = '#ecec19';

  gunWidth: number = 70;
  gunHeight: number = 20;

  hitBox: IHitBox = {
    x: this.x,
    y: this.y,
    width: this.heroHitBoxWidth,
    height: this.heroHitBoxHeight,
    prevPoint: {
      x: this.x,
      y: this.y,
    },
  };

  constructor() {
    super();

    const hero = this.getImage();

    this.addChild(hero);

    hero.pivot.x = this.heroHitBoxWidth / 2;
    hero.x = this.heroHitBoxWidth / 2;

    const heroPivot = new Graphics()
      .circle(hero.pivot.x, hero.pivot.y, 3)
      .fill('red');

    hero.addChild(heroPivot);
  }

  getImage(settings?: { shootAngle?: 0 | 45 | -45 | 90; tilt?: boolean }) {
    const hero = new Graphics()
      .rect(this.x, this.y, this.heroHitBoxWidth, this.heroHitBoxHeight)
      .stroke(this.heroHitBoxColor);

    hero.strokeStyle.width = DEFAULT_STROKE_WIDTH;

    if (!settings) return hero;

    if (settings.shootAngle) {
      const gun = new Graphics()
        .rect(0, 0, this.gunWidth, this.gunHeight)
        .stroke('#66b466');

      gun.pivot.y = this.gunHeight / 2;
      gun.pivot.x = this.gunWidth / 4;

      gun.x = this.heroHitBoxWidth - this.heroHitBoxWidth / 7;
      gun.y = this.heroHitBoxHeight / 3;

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
