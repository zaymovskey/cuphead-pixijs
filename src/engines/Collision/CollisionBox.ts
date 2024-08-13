import { ICollisionBox } from '@/entities/BaseView';
import { PointData } from 'pixi.js';

export class CollisionBox implements ICollisionBox {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  prevPoint: PointData = {
    x: 0,
    y: 0,
  };

  constructor(params: ICollisionBox) {
    this.x = params.x ?? this.x;
    this.y = params.y ?? this.y;
    this.width = params.width ?? this.width;
    this.height = params.height ?? this.height;
    this.prevPoint = params.prevPoint ?? this.prevPoint;
  }
}
