import { Graphics } from "pixi.js";
import { BaseEntity } from "./BaseEntity.ts";
import { Gravity } from "../engines/Gravity.ts";

export class Hero extends BaseEntity {
  gravity: Gravity = new Gravity(this, 0.2, 2);
  collisionEntities: BaseEntity[] = [];

  constructor(collisionEntities: BaseEntity[]) {
    super(collisionEntities);

    this.collisionEntities = collisionEntities;
    const view = new Graphics().rect(this.x, this.y, 40, 100).stroke("#66b466");
    view.strokeStyle.width = 2;
    this.addChild(view);
  }

  update() {}
}
