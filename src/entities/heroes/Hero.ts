import { Gravity } from '@/engines/Gravity';
import { KeyboardProcessor } from '@/engines/KeyboardProcessor';
import { Movement } from '@/engines/Movement';
import {
  Collision,
  ICollisionHandlers,
  ICollisionWithScreenBordersHandlers,
} from '@/engines/Сollision.ts';
import { BaseEntity, IHitBox } from '@/entities/BaseEntity';
import { Graphics } from 'pixi.js';

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
  movement: Movement = new Movement(this, 6, 0, 23);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;
  keyboardProcessor: KeyboardProcessor = new KeyboardProcessor();

  hitBoxWidth: number = 80;
  hitBoxHeight: number = 100;

  hitBox: IHitBox = {
    x: this.x,
    y: this.y,
    width: this.hitBoxWidth,
    height: this.hitBoxHeight,
  };

  isCanJump: boolean = true;

  constructor(collisionEntities: BaseEntity[]) {
    super();

    this.collisionEntities = collisionEntities;

    const hero = new Graphics()
      .rect(this.x, this.y, this.hitBoxWidth, this.hitBoxHeight)
      .stroke('#66b466')
      .rect(
        this.x + this.hitBoxWidth,
        this.y + this.hitBoxHeight / 2 - 20 / 2,
        40,
        20
      )
      .stroke('#66b466');

    this.addChild(hero);

    hero.pivot.x = 40;
    hero.x = 40;

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
    collisionHandlers.bottom = (_, collisionEntity) => {
      this.y = collisionEntity.y - this.hitBoxHeight;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };
    collisionHandlers.left = (_, collisionEntity) => {
      this.x = collisionEntity.x - this.hitBoxWidth;
    };
    collisionHandlers.right = (_, collisionEntity) => {
      this.x = collisionEntity.x + collisionEntity.width;
    };

    const collisionWithScreenBordersHandlers: ICollisionWithScreenBordersHandlers =
      {};
    collisionWithScreenBordersHandlers.top = () => {
      this.y = 0;
      this.gravity.velocityY = 0;
    };
    collisionWithScreenBordersHandlers.bottom = () => {
      this.y = window.innerHeight - this.hitBoxHeight;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };

    collisionWithScreenBordersHandlers.left = () => {
      this.x = 0;
    };
    collisionWithScreenBordersHandlers.right = () => {
      this.x = window.innerWidth - this.hitBoxWidth;
    };

    this.collision = new Collision(
      this,
      this.collisionEntities,
      collisionHandlers,
      collisionWithScreenBordersHandlers
    );
  }
}
