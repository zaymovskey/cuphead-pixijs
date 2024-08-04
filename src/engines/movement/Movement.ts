import { BaseEntity } from "../../entities/BaseEntity.ts";

export const movementKeys: Record<string, string[]> = {
  RIGHT: ["arrowright", "d", "в"],
  LEFT: ["arrowleft", "a", "ф"],
  UP: ["arrowup", "w", "ц"],
};

type TypeMovement = -1 | 0 | 1;

export class Movement {
  private velocityX: number;
  private readonly maxVelocityX: number;

  private readonly jumpAcceleration: number;

  private entity: BaseEntity;

  private movement: { x: TypeMovement } = {
    x: 0,
  };

  private directionContext: { left: TypeMovement; right: TypeMovement } = {
    left: 0,
    right: 0,
  };

  constructor(
    entity: BaseEntity,
    maxVelocityX: number,
    velocityX?: number,
    jumpAcceleration?: number,
  ) {
    this.entity = entity;
    this.velocityX = velocityX || 0;
    this.maxVelocityX = maxVelocityX;
    this.jumpAcceleration = jumpAcceleration || 7;

    document.addEventListener("keydown", (ev) => this.onKeyDown(ev.key));
    document.addEventListener("keyup", (ev) => this.onKeyUp(ev.key));
  }

  update() {
    this.velocityX = this.movement.x * this.maxVelocityX;
    this.entity.x += this.velocityX;
  }

  startLeftMove() {
    this.directionContext.left = -1;
    this.movement.x = -1;
  }

  startRightMove() {
    this.directionContext.right = 1;
    this.movement.x = 1;
  }

  stopLeftMove() {
    this.directionContext.left = 0;
    this.movement.x = this.directionContext.right;
  }

  stopRightMove() {
    this.directionContext.right = 0;
    this.movement.x = this.directionContext.left;
  }

  jump() {
    if (!this.entity.gravity) return;

    if (this.entity.state !== "jump") {
      this.entity.state = "jump";
      this.entity.gravity.velocityY -= this.jumpAcceleration;
    }
  }

  onKeyDown(key: string) {
    const lowerKey = key.toLowerCase();
    if (movementKeys.LEFT.includes(lowerKey)) {
      this.startLeftMove();
    }
    if (movementKeys.RIGHT.includes(lowerKey)) {
      this.startRightMove();
    }
    if (movementKeys.UP.includes(lowerKey)) {
      this.jump();
    }
  }

  onKeyUp(key: string) {
    const lowerKey = key.toLowerCase();
    if (movementKeys.LEFT.includes(lowerKey)) {
      this.stopLeftMove();
    }
    if (movementKeys.RIGHT.includes(lowerKey)) {
      this.stopRightMove();
    }
  }
}