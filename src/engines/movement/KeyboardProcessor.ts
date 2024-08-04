interface keyMapExecuteHandlers {
  executeDown?: () => void;
  executeUp?: () => void;
}

export class KeyboardProcessor {
  private keyMap: {
    [key in string]: keyMapExecuteHandlers;
  } = {};

  constructor() {
    document.addEventListener("keydown", (ev) => this.onKeyDown(ev.key));
    document.addEventListener("keyup", (ev) => this.onKeyUp(ev.key));
  }

  setButtonsHandlers(
    keyName: string | string[],
    executeHandlers: keyMapExecuteHandlers,
  ) {
    if (Array.isArray(keyName)) {
      keyName.forEach((key) => {
        this.keyMap[key] = executeHandlers;
      });
    } else {
      this.keyMap[keyName] = executeHandlers;
    }
  }

  onKeyDown(key: string) {
    const button = this.keyMap[key];
    button.executeDown?.();
  }

  onKeyUp(key: string) {
    const button = this.keyMap[key];
    button.executeUp?.();
  }
}
