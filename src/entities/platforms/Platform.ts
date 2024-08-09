import { BaseEntity } from '@/entities/BaseEntity';
import { PlatformView } from '@/entities/platforms/PlatformView.ts';

export interface IPlatformSize {
  width: number;
  height: number;
}

export class Platform extends BaseEntity {
  constructor(size: IPlatformSize) {
    super(new PlatformView(size));
  }
}
