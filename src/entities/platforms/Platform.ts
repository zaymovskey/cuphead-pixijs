import { BaseEntity } from '@/entities/BaseEntity';
import { Graphics } from 'pixi.js';

export interface IPlatformSize {
  width: number;
  height: number;
}

export class Platform extends BaseEntity {
  constructor(size: IPlatformSize) {
    super();
    const view = new Graphics()
      .rect(this.x, this.y, size.width, size.height)
      .stroke('#ecec19');

    this.addChild(view);
  }
}
