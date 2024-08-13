import { BaseView, IStm } from '@/entities/BaseView';
import { EnumHeroStates } from '@/entities/hero/Hero';
import { createHeroStateMachine } from '@/entities/hero/utils/createHeroStateMachine';
import { Container, Graphics } from 'pixi.js';

export class HeroView extends BaseView<EnumHeroStates> {
  bodyWidth: number = 65;
  bodyHeight: number = 150;
  bodyColor: string = '#ecec19';

  gunWidth: number = 70;
  gunHeight: number = 20;
  gunColor: string = '#66b466';

  stateMachine: IStm<EnumHeroStates> = createHeroStateMachine(this);

  rootNode: Container = new Container();

  constructor() {
    super();

    console.log(this.stateMachine.states);
    this.setStatesImages(this.stateMachine.states);

    this.rootNode.pivot.x = this.bodyWidth / 2;
    this.rootNode.x = this.bodyWidth / 2;

    this.addChild(this.rootNode);
  }

  getImage(settings?: {
    shootAngle?: number;
    tilt?: boolean;
    width?: number;
    height?: number;
  }) {
    const hero = new Graphics()
      .rect(
        this.x,
        this.y,
        settings?.width || this.bodyWidth,
        settings?.height || this.bodyHeight
      )
      .stroke(this.bodyColor);

    hero.strokeStyle.width = this.DEFAULT_STROKE_WIDTH;

    if (!settings) return hero;

    if (settings.shootAngle !== undefined) {
      const gun = new Graphics()
        .rect(0, 0, this.gunWidth, this.gunHeight)
        .stroke(this.gunColor);

      gun.strokeStyle.width = this.DEFAULT_STROKE_WIDTH;

      gun.pivot.y = this.gunHeight / 2;
      gun.pivot.x = this.gunWidth / 4;

      gun.x = this.bodyWidth - this.bodyWidth / 7;
      gun.y = (settings?.height || this.bodyHeight) / 2;

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
