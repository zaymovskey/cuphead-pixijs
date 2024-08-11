import { Gravity } from '@/engines/Gravity';
import { KeyboardProcessor } from '@/engines/KeyboardProcessor';
import { Movement } from '@/engines/Movement';
import {
  Collision,
  ICollisionHandlers,
  ICollisionWithScreenBordersHandlers,
} from '@/engines/Сollision.ts';
import { BaseEntity } from '@/entities/BaseEntity';
import { HeroView } from '@/entities/heroes/HeroView.ts';

export enum EnumHeroStates {
  stay = 'stay',
  jump = 'jump',
  fallDown = 'fallDown',
}
export const movementKeys: Record<string, string[]> = {
  RIGHT: ['ArrowRight', 'd', 'D', 'в', 'В'],
  LEFT: ['ArrowLeft', 'a', 'A', 'ф', 'Ф'],
  UP: ['Z', 'z', 'Я', 'я'],
};

export class Hero extends BaseEntity {
  gravity: Gravity = new Gravity(this, 0.9, 0);
  movement: Movement = new Movement(this, 9, 0, 23);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;
  keyboardProcessor: KeyboardProcessor = new KeyboardProcessor();

  isCanJump: boolean = true;

  constructor(collisionEntities: BaseEntity[]) {
    super(new HeroView());

    this.collisionEntities = collisionEntities;

    this.setControl();
    this.setCollisionHandlers();
  }

  update() {
    this.movement.update();

    if (this.gravity.velocityY < 0) {
      this.collision!.collisionsIsActive.collisionEntities = false;
    }

    if (this.gravity.velocityY > 0) {
      this.collision!.collisionsIsActive.collisionEntities = true;
      this.state = EnumHeroStates.fallDown;
    }
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
        if (this.state !== EnumHeroStates.stay || !this.isCanJump) return;
        this.movement.jump();
        this.isCanJump = false;
      },
      executeUp: () => {
        this.isCanJump = true;
      },
    });
  }

  setCollisionHandlers() {
    const collisionHandlers: ICollisionHandlers = {};
    collisionHandlers.bottom = (_, collisionEntityHB) => {
      this.view.hitBox.y = collisionEntityHB.y - this.view.hitBox.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };
    collisionHandlers.left = (_, collisionEntityHB) => {
      this.view.hitBox.x = collisionEntityHB.x - this.view.hitBox.width;
    };
    collisionHandlers.right = (_, collisionEntityHB) => {
      this.view.hitBox.x = collisionEntityHB.x + collisionEntityHB.width;
    };

    const collisionWithScreenBordersHandlers: ICollisionWithScreenBordersHandlers =
      {};
    collisionWithScreenBordersHandlers.top = () => {
      this.view.hitBox.y = 0;
      this.gravity.velocityY = 0;
    };
    collisionWithScreenBordersHandlers.bottom = () => {
      this.view.hitBox.y = window.innerHeight - this.view.hitBox.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };

    collisionWithScreenBordersHandlers.left = () => {
      this.view.hitBox.x = 0;
    };
    collisionWithScreenBordersHandlers.right = () => {
      this.view.hitBox.x = window.innerWidth - this.view.hitBox.width;
    };

    this.collision = new Collision(
      this,
      this.collisionEntities,
      collisionHandlers,
      collisionWithScreenBordersHandlers
    );
  }
}
