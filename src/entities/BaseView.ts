import { getEntriesFromObj } from '@/utils/getEntriesFromObj.ts';
import { Container, Graphics, PointData } from 'pixi.js';

export interface IStm<StateNames extends string | number | symbol> {
  currentState: StateNames | 'default';
  states: {
    [key in StateNames | 'default']: {
      image: Graphics;
      hitBoxSize?: { width: number; height: number };
    };
  };
}

export interface IHitBox {
  x: number;
  y: number;
  width: number;
  height: number;
  prevPoint: PointData;
}

export abstract class BaseView<
  States extends string | number | symbol = string | number | symbol,
> extends Container {
  DEFAULT_STROKE_WIDTH = 4;

  stateMachine?: IStm<States>;

  rootNode?: Container;

  public hitBox: IHitBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    prevPoint: {
      x: 0,
      y: 0,
    },
  };

  protected constructor() {
    super();
    this.createNodeStructure();
  }

  createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    this.rootNode = rootNode;
  }

  toState(newStateName: States, changeHitBox: boolean = true) {
    if (!this.stateMachine || newStateName === this.stateMachine.currentState) {
      return;
    }

    getEntriesFromObj(this.stateMachine.states).forEach(([stateName, _]) => {
      this.stateMachine!.states[stateName].image.visible = false;
    });

    const newState = this.stateMachine.states[newStateName];
    newState.image.visible = true;
    if (changeHitBox && newState.hitBoxSize) {
      this.hitBox = { ...this.hitBox, ...newState.hitBoxSize };
    }
  }

  flip(direction: 'left' | 'right') {
    this.rootNode!.scale.x = direction === 'left' ? -1 : 1;
  }

  setStatesImages(states: {
    [key in States | 'default']: { image: Graphics; hitBox?: IHitBox };
  }) {
    getEntriesFromObj(states).forEach(([stateName, state]) => {
      if (stateName !== 'default') {
        state.image.visible = false;
      }
      this.rootNode!.addChild(state.image);
    });
  }
}
