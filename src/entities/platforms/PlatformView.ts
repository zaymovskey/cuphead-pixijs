import { IPlatformSize } from '@/entities/platforms/Platform.ts';
import { Container, Graphics } from 'pixi.js';

export class PlatformView extends Container {
  constructor(size: IPlatformSize) {
    super();

    const platform = new Graphics()
      .rect(this.x, this.y, size.width, size.height)
      .stroke('#ecec19');

    this.addChild(platform);
  }
}
