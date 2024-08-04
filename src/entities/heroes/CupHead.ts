import { Graphics } from "pixi.js";
import { BaseEntity } from "../BaseEntity.ts";
import { Gravity } from "../../engines/Gravity.ts";
import { Movement } from "../../engines/Movement.ts";
import { KeyboardProcessor } from "../../engines/KeyboardProcessor.ts";

export enum EnumHeroStates {
  stay = "stay",
  jump = "jump",
}
export const movementKeys: Record<string, string[]> = {
  RIGHT: ["ArrowRight", "d", "D", "в", "В"],
  LEFT: ["ArrowLeft", "a", "A", "ф", "Ф"],
  UP: ["ArrowUp", "w", "W", "ц", "Ц"],
};

export class CupHead extends BaseEntity {
  gravity: Gravity = new Gravity(this, 0.2, 2);
  movement: Movement = new Movement(this, 2);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;
  keyboardProcessor: KeyboardProcessor = new KeyboardProcessor();

  constructor(collisionEntities: BaseEntity[]) {
    super(collisionEntities);

    this.collisionEntities = collisionEntities;
    const view = new Graphics().rect(this.x, this.y, 40, 100).stroke("#66b466");
    view.strokeStyle.width = 2;
    this.addChild(view);

    this.setControl();
  }

  update() {
    this.movement.update();
  }

  setControl() {
    this.keyboardProcessor.setButtonsHandlers(movementKeys.RIGHT, {
      executeDown: () => {
        this.movement.startRightMove();
      },
      executeUp: () => {
        this.movement.stopRightMove();
      },
    });

    this.keyboardProcessor.setButtonsHandlers(movementKeys.LEFT, {
      executeDown: () => {
        this.movement.startLeftMove();
      },
      executeUp: () => {
        this.movement.stopLeftMove();
      },
    });

    this.keyboardProcessor.setButtonsHandlers(movementKeys.UP, {
      executeDown: () => {
        this.movement.jump();
      },
    });
  }
}
