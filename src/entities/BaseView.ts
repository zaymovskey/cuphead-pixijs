import { Container, PointData } from 'pixi.js';

export interface IHitBox {
  x: number;
  y: number;
  width: number;
  height: number;
  prevPoint: PointData;
}

export abstract class BaseView extends Container {
  public prevPoint: PointData = {
    x: 0,
    y: 0,
  };
  public hitBox: IHitBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    prevPoint: {
      x: 0,
      y: 0,
    },
  };
}
