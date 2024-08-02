import { Graphics } from "pixi.js";
import { BaseEntity } from "./BaseEntity.ts";

interface IPlatformSize {
  width: number;
  height: number;
}

export class Platform extends BaseEntity {
  constructor(size: IPlatformSize) {
    super();
    const view = new Graphics()
      .rect(this.x, this.y, ...(<[number, number]>Object.values(size)))
      .stroke("#ecec19");

    view.strokeStyle.width = 2;
    this.addChild(view);
  }
}
