import { BaseEntity } from "../../BaseEntity.ts";
import { KeyboardProcessor } from "../../../engines/movement/KeyboardProcessor.ts";

export const movementKeys: Record<string, string[]> = {
  RIGHT: ["ArrowRight", "d", "D", "в", "В"],
  LEFT: ["ArrowLeft", "a", "A", "ф", "Ф"],
  UP: ["ArrowUp", "w", "W", "ц", "Ц"],
};

export class CupHeadControl {
  private entity: BaseEntity;

  constructor(entity: BaseEntity) {
    this.entity = entity;

    const keyboardProcessor = new KeyboardProcessor();

    keyboardProcessor.setButtonsHandlers(movementKeys.RIGHT, {
      executeDown: () => {
        this.entity.movement!.startRightMove();
      },
      executeUp: () => {
        this.entity.movement!.stopRightMove();
      },
    });

    keyboardProcessor.setButtonsHandlers(movementKeys.LEFT, {
      executeDown: () => {
        this.entity.movement!.startLeftMove();
      },
      executeUp: () => {
        this.entity.movement!.stopLeftMove();
      },
    });

    keyboardProcessor.setButtonsHandlers(movementKeys.UP, {
      executeDown: () => {
        this.entity.movement!.jump();
      },
    });
  }
}
