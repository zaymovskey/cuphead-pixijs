import { Graphics } from "pixi.js";
import { BaseEntity } from "@/entities/BaseEntity";
import { Gravity } from "@/engines/Gravity";
import { Movement } from "@/engines/Movement";
import { KeyboardProcessor } from "@/engines/KeyboardProcessor";
import {
  Collision,
  ICollisionHandlers,
  ICollisionWithScreenBordersHandlers,
  TypeCollisionHandler,
  TypeCollisionWithScreenBordersHandler,
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
  movement: Movement = new Movement(this, 60, 0, 23);
  collisionEntities: BaseEntity[] = [];
  state: EnumHeroStates = EnumHeroStates.stay;
  keyboardProcessor: KeyboardProcessor = new KeyboardProcessor();

  canJump: boolean = true;

  heroWidth: number = 80;
  heroHeight: number = 100;

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
        if (this.state !== EnumHeroStates.stay || !this.canJump) return;
        this.movement.jump();
        this.canJump = false;
      },
      executeUp: () => {
        this.canJump = true;
      },
    });
  }

  setCollisionHandlers() {
    const collisionHandlers: ICollisionHandlers = {};
    collisionHandlers.top = (prevPoint, _) => {
      this.y = prevPoint.y;
      this.gravity.velocityY = 0;
    };
    collisionHandlers.bottom = (_, collisionEntity) => {
      this.y = collisionEntity.y - this.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };
    const collisionHandlerX: TypeCollisionHandler = (prevPoint, _) => {
      this.x = prevPoint.x;
    };
    collisionHandlers.right = collisionHandlerX;
    collisionHandlers.left = collisionHandlerX;

    const collisionWithScreenBordersHandlers: ICollisionWithScreenBordersHandlers =
      {};
    collisionWithScreenBordersHandlers.bottom = () => {
      this.y = window.innerHeight - this.height;
      this.gravity.velocityY = 0;
      this.state = EnumHeroStates.stay;
    };
    const collisionWithScreenBordersHandlerX: TypeCollisionWithScreenBordersHandler =
      (prevPoint) => {
        this.x = prevPoint.x;
      };
    collisionWithScreenBordersHandlers.left =
      collisionWithScreenBordersHandlerX;
    collisionWithScreenBordersHandlers.right =
      collisionWithScreenBordersHandlerX;

    this.collision = new Collision(
      this,
      this.collisionEntities,
      collisionHandlers,
      collisionWithScreenBordersHandlers,
    );
  }
}
