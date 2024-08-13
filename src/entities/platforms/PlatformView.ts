import { BaseView } from '@/entities/BaseView';
import { IPlatformSize } from '@/entities/platforms/Platform';
import { Graphics } from 'pixi.js';

export class PlatformView extends BaseView {
  platformColor: string = '#0884bc';

  constructor(size: IPlatformSize) {
    super();

    const platform = new Graphics()
      .rect(this.x, this.y, size.width, size.height)
      .stroke(this.platformColor);

    platform.strokeStyle.width = this.DEFAULT_STROKE_WIDTH;

    this.addChild(platform);
  }
}
