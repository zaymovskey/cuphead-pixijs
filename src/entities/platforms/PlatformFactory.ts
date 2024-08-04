import { IPlatformSize, Platform } from "@/entities/platforms/Platform";
import { Application, PointData } from "pixi.js";

export default class PlatformFactory {
  pixiApp: Application;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;
  }

  createPlatform(position: PointData, size: IPlatformSize) {
    const platform = new Platform(size);
    platform.position = position;
    this.pixiApp.stage.addChild(platform);

    return platform;
  }
}
