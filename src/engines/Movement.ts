import { BaseEntity } from '@/entities/BaseEntity';

type TypeMovement = -1 | 0 | 1;

export class Movement {
  public velocityX: number;
  private readonly maxVelocityX: number;

  private readonly jumpAcceleration: number;

  private entity: BaseEntity;

  private movement: { x: TypeMovement } = {
    x: 0,
  };

  private directionContext: { left: boolean; right: boolean } = {
    left: false,
    right: false,
  };

  constructor(
    entity: BaseEntity,
    maxVelocityX: number,
    velocityX?: number,
    jumpAcceleration?: number
  ) {
    this.entity = entity;
    this.velocityX = velocityX || 0;
    this.maxVelocityX = maxVelocityX;
    this.jumpAcceleration = jumpAcceleration || 7;
  }

  update() {
    this.velocityX = this.movement.x * this.maxVelocityX;
    this.entity.collisionBox.x += this.velocityX;
  }

  startLeftMove() {
    this.directionContext.left = true;
    if (!this.directionContext.right) {
      this.movement.x = -1;
    }
  }

  startRightMove() {
    this.directionContext.right = true;
    if (!this.directionContext.left) {
      this.movement.x = 1;
    }
  }

  stopLeftMove() {
    this.directionContext.left = false;
    if (this.directionContext.right) {
      this.movement.x = 1;
    } else {
      this.movement.x = 0;
    }
  }

  stopRightMove() {
    this.directionContext.right = false;
    if (this.directionContext.left) {
      this.movement.x = -1;
    } else {
      this.movement.x = 0;
    }
  }

  jump() {
    if (!this.entity.gravity) return;

    if (this.entity.state !== 'jump') {
      this.entity.state = 'jump';
      this.entity.gravity.velocityY -= this.jumpAcceleration;
    }
  }
}
