import { Graphics } from "pixi.js";
import { BaseEntity } from "./BaseEntity.ts";
import { Gravity, movementKeys } from "../engines/Gravity.ts";

enum EnumHeroStates {
  stay = "stay",
  jump = "jump",
}

export class Hero extends BaseEntity {
  gravity: Gravity = new Gravity(this, 0.2, 2);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;

  constructor(collisionEntities: BaseEntity[]) {
    super(collisionEntities);

    this.collisionEntities = collisionEntities;
    const view = new Graphics().rect(this.x, this.y, 40, 100).stroke("#66b466");
    view.strokeStyle.width = 2;
    this.addChild(view);

    document.addEventListener("keydown", (ev) => this.onKeyDown(ev.key));
    document.addEventListener("keyup", (ev) => this.onKeyUp(ev.key));
  }

  update() {}

  onKeyDown(key: string) {
    const lowerKey = key.toLowerCase();
    if (movementKeys.LEFT.includes(lowerKey)) {
      this.gravity.startLeftMove();
    }
    if (movementKeys.RIGHT.includes(lowerKey)) {
      this.gravity.startRightMove();
    }
  }

  onKeyUp(key: string) {
    const lowerKey = key.toLowerCase();
    if (movementKeys.LEFT.includes(lowerKey)) {
      this.gravity.stopLeftMove();
    }
    if (movementKeys.RIGHT.includes(lowerKey)) {
      this.gravity.stopRightMove();
    }
    if (movementKeys.UP.includes(lowerKey)) {
      this.gravity.jump();
    }
  }
}
