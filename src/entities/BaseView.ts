import { getEntriesFromObj } from '@/utils/getEntriesFromObj.ts';
import { Container, Graphics, PointData } from 'pixi.js';

type TypeStmStatesWithDefault<States extends string = string> =
  | States
  | 'default';

export interface IStm<States extends string = string> {
  currentState: TypeStmStatesWithDefault<States>;
  states: {
    [key in TypeStmStatesWithDefault<States>]: {
      image: Graphics;
      collisionBoxSize?: { width: number; height: number };
    };
  };
}

export interface ICollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  prevPoint: PointData;
}

export abstract class BaseView<
  States extends string | 'default' = string,
> extends Container {
  DEFAULT_STROKE_WIDTH = 4;

  stateMachine?: IStm<States>;

  rootNode?: Container;

  protected constructor() {
    super();
    this.createNodeStructure();
  }

  createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    this.rootNode = rootNode;
  }

  toState(newStateName: TypeStmStatesWithDefault<States>) {
    if (
      !this.stateMachine ||
      (newStateName === this.stateMachine.currentState &&
        newStateName !== 'default')
    ) {
      return;
    }

    getEntriesFromObj(this.stateMachine.states).forEach(([stateName, _]) => {
      this.stateMachine!.states[stateName].image.visible = false;
    });

    const newState = this.stateMachine.states[newStateName];
    newState.image.visible = true;
  }

  flip(direction: 'left' | 'right') {
    this.rootNode!.scale.x = direction === 'left' ? -1 : 1;
  }

  setStatesImages(states: Pick<IStm<States>, 'states'>['states']) {
    getEntriesFromObj(states).forEach(([_, state]) => {
      state.image.visible = false;
      this.rootNode!.addChild(state.image);
    });

    this.toState('default');
  }
}
