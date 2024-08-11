import { DEFAULT_STROKE_WIDTH } from '@/consts/global';
import { BaseView, IHitBox } from '@/entities/BaseView';
import { Graphics } from 'pixi.js';

export class HeroView extends BaseView {
  heroHitBoxWidth: number = 65;
  heroHitBoxHeight: number = 150;
  heroHitBoxColor: string = '#ecec19';

  gunWidth: number = 70;
  gunHeight: number = 20;
  gunColor: string = '#66b466';

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

    const hero = this.getImage({ shootAngle: -90 });

    this.addChild(hero);

    hero.pivot.x = this.heroHitBoxWidth / 2;
    hero.x = this.heroHitBoxWidth / 2;

    const heroPivot = new Graphics()
      .circle(hero.pivot.x, hero.pivot.y, 3)
      .fill('red');

    hero.addChild(heroPivot);
  }

  getImage(settings?: { shootAngle?: number; tilt?: boolean }) {
    const hero = new Graphics()
      .rect(this.x, this.y, this.heroHitBoxWidth, this.heroHitBoxHeight)
      .stroke(this.heroHitBoxColor);

    hero.strokeStyle.width = DEFAULT_STROKE_WIDTH;

    if (!settings) return hero;

    if (settings.shootAngle) {
      const gun = new Graphics()
        .rect(0, 0, this.gunWidth, this.gunHeight)
        .stroke(this.gunColor);

      gun.strokeStyle.width = DEFAULT_STROKE_WIDTH;

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

      if (settings.shootAngle === -90) {
        gun.y = this.gunHeight;
      }
    }

    if (settings.tilt) {
      hero.skew.x = -0.1;
    }
    return hero;
  }
}
