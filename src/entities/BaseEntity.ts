import { Container, PointData } from "pixi.js";
import { Gravity } from "@/engines/Gravity";
import { Collision } from "@/engines/Сollision.ts";
import { EnumHeroStates } from "@/entities/heroes/Hero.ts";
import { Movement } from "@/engines/Movement";

export interface IHitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export abstract class BaseEntity extends Container {
  gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string | EnumHeroStates;
  public prevPoint: PointData = { x: 0, y: 0 };
  public hitBox?: IHitBox;

  protected constructor() {
    super();
  }

  protected update() {}

  public completeUpdate(): void {
    this.prevPoint = { x: this.x, y: this.y };

    this.gravity?.update();
    this.update();

    if (this.hitBox) {
      this.hitBox.x = this.x;
      this.hitBox.y = this.y;
    }

    this.collision?.update();
  }
}
