import { BaseView, IHitBox } from '@/entities/BaseView.ts';
import { Graphics } from 'pixi.js';

export class HeroView extends BaseView {
  hitBoxWidth: number = 80;
  hitBoxHeight: number = 100;

  gunWidth: number = 40;
  gunHeight: number = 20;

  hitBox: IHitBox = {
    x: this.x,
    y: this.y,
    width: this.hitBoxWidth,
    height: this.hitBoxHeight,
  };

  constructor() {
    super();

    const hero = new Graphics()
      .rect(this.x, this.y, this.hitBoxWidth, this.hitBoxHeight)
      .stroke('#66b466')
      .rect(
        this.x + this.hitBoxWidth,
        this.y + this.hitBoxHeight / 2 - this.gunHeight / 2,
        this.gunWidth,
        this.gunHeight
      )
      .stroke('#66b466');

    this.addChild(hero);

    hero.pivot.x = 40;
    hero.x = 40;
  }
}
