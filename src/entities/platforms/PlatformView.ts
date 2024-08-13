import { BaseView, ICollisionBox } from '@/entities/BaseView';
import { IPlatformSize } from '@/entities/platforms/Platform';
import { Graphics } from 'pixi.js';

export class PlatformView extends BaseView {
  platformColor: string = '#0884bc';

  collisionBox: ICollisionBox = {
    x: this.x,
    y: this.y,
    width: 0,
    height: 0,
    prevPoint: {
      x: this.x,
      y: this.y,
    },
  };

  constructor(size: IPlatformSize) {
    super();

    this.collisionBox.width = size.width;
    this.collisionBox.height = size.height;

    const platform = new Graphics()
      .rect(this.x, this.y, size.width, size.height)
      .stroke(this.platformColor);

    platform.strokeStyle.width = this.DEFAULT_STROKE_WIDTH;

    this.addChild(platform);
  }
}
