import { DEFAULT_STROKE_WIDTH } from '@/consts/global.ts';
import { BaseView } from '@/entities/BaseView.ts';
import { IPlatformSize } from '@/entities/platforms/Platform.ts';
import { Graphics } from 'pixi.js';

export class PlatformView extends BaseView {
  platformColor: string = '#0884bc';

  constructor(size: IPlatformSize) {
    super();

    const platform = new Graphics()
      .rect(this.x, this.y, size.width, size.height)
      .stroke(this.platformColor);

    platform.strokeStyle.width = DEFAULT_STROKE_WIDTH;

    this.addChild(platform);
  }
}
