import { Graphics } from "pixi.js";
import { BaseEntity, IBounds } from "@/entities/BaseEntity";
import { Gravity } from "@/engines/Gravity";
import { Movement } from "@/engines/Movement";
import { KeyboardProcessor } from "@/engines/KeyboardProcessor";
import {
  Collision,
  ICollisionHandlers,
  ICollisionWithScreenBordersHandlers,
} from "@/engines/Сollision.ts";

export enum EnumHeroStates {
  stay = "stay",
  jump = "jump",
  fallDown = "fallDown",
}
export const movementKeys: Record<string, string[]> = {
  RIGHT: ["ArrowRight", "d", "D", "в", "В"],
  LEFT: ["ArrowLeft", "a", "A", "ф", "Ф"],
  UP: ["Z", "z", "Я", "я"],
};

export class Hero extends BaseEntity {
  gravity: Gravity = new Gravity(this, 0.9, 0);
  movement: Movement = new Movement(this, 6, 0, 23);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;
  keyboardProcessor: KeyboardProcessor = new KeyboardProcessor();

  heroWidth: number = 80;
  heroHeight: number = 100;

  bounds: IBounds = {
    x: 0,
    y: 0,
    width: this.heroWidth,
    height: this.heroHeight,
  };

  isCanJump: boolean = true;

  constructor(collisionEntities: BaseEntity[]) {
    super();

    this.collisionEntities = collisionEntities;

    const hero = new Graphics()
      .rect(this.x, this.y, this.heroWidth, this.heroHeight)
      .stroke("#66b466");

    hero.strokeStyle.width = 2;

    this.addChild(hero);

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
      this.y = collisionEntity.y - this.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };
    collisionHandlers.left = (_, collisionEntity) => {
      this.x = collisionEntity.x - this.width;
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
      this.y = window.innerHeight - this.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };

    collisionWithScreenBordersHandlers.left = () => {
      this.x = 0;
    };
    collisionWithScreenBordersHandlers.right = () => {
      this.x = window.innerWidth - this.width;
    };

    this.collision = new Collision(
      this,
      this.collisionEntities,
      collisionHandlers,
      collisionWithScreenBordersHandlers,
    );
  }
}
