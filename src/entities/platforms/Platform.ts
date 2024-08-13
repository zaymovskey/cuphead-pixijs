import { CollisionBox } from '@/engines/Collision/CollisionBox';
import { BaseEntity } from '@/entities/BaseEntity';
import { PlatformView } from '@/entities/platforms/PlatformView';
import { PointData } from 'pixi.js';

export interface IPlatformSize {
  width: number;
  height: number;
}

export class Platform extends BaseEntity {
  constructor(size: IPlatformSize, position: PointData) {
    super(
      new PlatformView(size),
      position,
      new CollisionBox({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        prevPoint: {
          x: 0,
          y: 0,
        },
      })
    );
  }
}
