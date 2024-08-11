import { IStm } from '@/entities/BaseView.ts';
import { EnumHeroStates } from '@/entities/hero/Hero.ts';
import { HeroView } from '@/entities/hero/HeroView.ts';

export const createHeroStateMachine = (heroView: HeroView) => {
  const defaultState = {
    image: heroView.getImage(),
    hitBoxSize: {
      width: heroView.heroHitBoxWidth,
      height: heroView.heroHitBoxHeight,
    },
  };

  const downStateSize = {
    width: defaultState.hitBoxSize.width,
    height: defaultState.hitBoxSize.height / 3,
  };

  const jumpState = {
    image: heroView.getImage({
      width: heroView.heroHitBoxWidth,
      height: heroView.heroHitBoxWidth,
    }),
    hitBoxSize: {
      width: heroView.heroHitBoxWidth,
      height: heroView.heroHitBoxWidth,
    },
  };

  const stateMachine: IStm<EnumHeroStates> = {
    currentState: 'default',

    states: {
      default: defaultState,

      stay: defaultState,
      stayShootStraight: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: 0 }),
      },
      stayShootUp: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: -90 }),
      },
      stayShootDown: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: 90 }),
      },
      stayShootDiagonallyUp: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: -45 }),
      },
      stayShootDiagonallyDown: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: 45 }),
      },

      run: {
        ...defaultState,
        image: heroView.getImage({ tilt: true }),
      },
      runShootStraight: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: 0, tilt: true }),
      },
      runShootUp: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: -90, tilt: true }),
      },
      runShootDiagonallyUp: {
        ...defaultState,
        image: heroView.getImage({ shootAngle: -45, tilt: true }),
      },

      down: {
        image: heroView.getImage(downStateSize),
        hitBoxSize: downStateSize,
      },
      downShoot: {
        image: heroView.getImage({ ...downStateSize, shootAngle: 0 }),
        hitBoxSize: downStateSize,
      },

      jump: jumpState,
      fallDown: jumpState,
    },
  };

  return stateMachine;
};
