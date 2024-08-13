import { CollisionBox } from '@/engines/Collision/CollisionBox.ts';
import {
  Collision,
  ICollisionHandlers,
  ICollisionWithScreenBordersHandlers,
} from '@/engines/Collision/Сollision.ts';
import { Gravity } from '@/engines/Gravity';
import { KeyboardProcessor } from '@/engines/KeyboardProcessor';
import { Movement } from '@/engines/Movement';
import { BaseEntity } from '@/entities/BaseEntity';
import { HeroView } from '@/entities/hero/HeroView.ts';
import { PointData } from 'pixi.js';

export enum EnumHeroStates {
  stay = 'stay',
  stayShootStraight = 'stayShootStraight',
  stayShootUp = 'stayShootUp',
  stayShootDown = 'stayShootDown',
  stayShootDiagonallyUp = 'stayShootDiagonallyUp',
  stayShootDiagonallyDown = 'stayShootDiagonallyDown',

  run = 'run',
  runShootStraight = 'runShootStraight',
  runShootUp = 'runShootUp',
  runShootDiagonallyUp = 'runShootDiagonallyUp',

  down = 'down',
  downShoot = 'downShoot',

  jump = 'jump',
  fallDown = 'fallDown',
}

export const movementKeys: Record<string, string[]> = {
  RIGHT: ['ArrowRight'],
  LEFT: ['ArrowLeft'],
  UP: ['Z', 'z', 'Я', 'я'],
};

export class Hero extends BaseEntity {
  gravity: Gravity = new Gravity(this, 0.9, 0);
  movement: Movement = new Movement(this, 9, 0, 23);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;
  keyboardProcessor: KeyboardProcessor = new KeyboardProcessor();

  isCanJump: boolean = true;

  constructor(collisionEntities: BaseEntity[], position: PointData) {
    super(
      new HeroView(),
      position,
      new CollisionBox({
        x: 0,
        y: 0,
        width: 65,
        height: 150,
        prevPoint: {
          x: 0,
          y: 0,
        },
      })
    );

    this.collisionEntities = collisionEntities;

    this.setMovementControl();
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

  setMovementControl() {
    this.keyboardProcessor.setButtonsHandlers(movementKeys.RIGHT, {
      executeDown: () => {
        this.movement.startRightMove({
          onStartMove: () => {
            this.view.flip('right');
            this.view.toState(EnumHeroStates.run);
          },
        });
      },
      executeUp: () => {
        this.movement.stopRightMove({
          onStopMove: () => {
            this.view.toState(EnumHeroStates.stay);
          },
          onChangeDirection: () => {
            this.view.flip('left');
            this.view.toState(EnumHeroStates.run);
          },
        });
      },
    });

    this.keyboardProcessor.setButtonsHandlers(movementKeys.LEFT, {
      executeDown: () => {
        this.movement.startLeftMove({
          onStartMove: () => {
            this.view.flip('left');
            this.view.toState(EnumHeroStates.run);
          },
        });
      },
      executeUp: () => {
        this.movement.stopLeftMove({
          onStopMove: () => {
            this.view.toState(EnumHeroStates.stay);
          },
          onChangeDirection: () => {
            this.view.flip('right');
            this.view.toState(EnumHeroStates.run);
          },
        });
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
      this.collisionBox.y = collisionEntityHB.y - this.collisionBox.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };
    collisionHandlers.left = (_, collisionEntityHB) => {
      this.collisionBox.x = collisionEntityHB.x - this.collisionBox.width;
    };
    collisionHandlers.right = (_, collisionEntityHB) => {
      this.collisionBox.x = collisionEntityHB.x + collisionEntityHB.width;
    };

    const collisionWithScreenBordersHandlers: ICollisionWithScreenBordersHandlers =
      {};
    collisionWithScreenBordersHandlers.top = () => {
      this.collisionBox.y = 0;
      this.gravity.velocityY = 0;
    };
    collisionWithScreenBordersHandlers.bottom = () => {
      this.collisionBox.y = window.innerHeight - this.collisionBox.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };

    collisionWithScreenBordersHandlers.left = () => {
      this.collisionBox.x = 0;
    };
    collisionWithScreenBordersHandlers.right = () => {
      this.collisionBox.x = window.innerWidth - this.collisionBox.width;
    };

    this.collision = new Collision(
      this.collisionBox,
      this.collisionEntities,
      collisionHandlers,
      collisionWithScreenBordersHandlers
    );
  }
}
