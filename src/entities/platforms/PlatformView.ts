import { DEFAULT_STROKE_WIDTH } from '@/consts/global.ts';
import { BaseView, IHitBox } from '@/entities/BaseView.ts';
import { IPlatformSize } from '@/entities/platforms/Platform.ts';
import { Graphics } from 'pixi.js';

export class PlatformView extends BaseView {
  platformColor: string = '#0884bc';

  hitBox: IHitBox = {
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

    this.hitBox.width = size.width;
    this.hitBox.height = size.height;

    const platform = new Graphics()
      .rect(this.x, this.y, size.width, size.height)
      .stroke(this.platformColor);

    platform.strokeStyle.width = DEFAULT_STROKE_WIDTH;

    this.addChild(platform);
  }
}
