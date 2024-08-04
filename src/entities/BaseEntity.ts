import { Container } from "pixi.js";
import { Gravity } from "../engines/Gravity.ts";
import { Collision } from "../engines/Сollision.ts";
import { EnumHeroStates } from "./heroes/CupHead.ts";
import { Movement } from "../engines/Movement.ts";

export abstract class BaseEntity extends Container {
  gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string | EnumHeroStates;

  protected constructor() {
    super();
  }

  protected update() {}

  public completeUpdate(): void {
    if (this.collision) {
      this.collision.prevPoint = { x: this.x, y: this.y };
    }

    this.gravity?.update();
    this.update();
    this.collision?.update();
  }
}
