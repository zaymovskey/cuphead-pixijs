import { Container, Graphics } from 'pixi.js';

export class HeroView extends Container {
  constructor(hitBoxWidth: number, hitBoxHeight: number) {
    super();

    const hero = new Graphics()
      .rect(this.x, this.y, hitBoxWidth, hitBoxHeight)
      .stroke('#66b466')
      .rect(this.x + hitBoxWidth, this.y + hitBoxHeight / 2 - 20 / 2, 40, 20)
      .stroke('#66b466');

    this.addChild(hero);

    hero.pivot.x = 40;
    hero.x = 40;
  }
}
