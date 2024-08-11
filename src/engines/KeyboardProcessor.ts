interface keyMapExecuteHandlers {
  executeDown?: () => void;
  executeUp?: () => void;
}

export class KeyboardProcessor {
  private keyMap: {
    [key in string]?: { handlers: keyMapExecuteHandlers; isPressed: boolean };
  } = {};

  constructor() {
    document.addEventListener('keydown', (ev) => this.onKeyDown(ev.key));
    document.addEventListener('keyup', (ev) => this.onKeyUp(ev.key));
  }

  setButtonsHandlers(
    keyName: string | string[],
    executeHandlers: keyMapExecuteHandlers
  ) {
    const keyInfo = { handlers: executeHandlers, isPressed: false };
    if (Array.isArray(keyName)) {
      keyName.forEach((key) => {
        this.keyMap[key] = keyInfo;
      });
    } else {
      this.keyMap[keyName] = keyInfo;
    }
  }

  onKeyDown(key: string) {
    const button = this.keyMap[key];
    if (!button) return;
    button.isPressed = true;
    button.handlers.executeDown?.();
  }

  onKeyUp(key: string) {
    const button = this.keyMap[key];
    if (!button) return;
    button.isPressed = false;
    button?.handlers.executeUp?.();
  }

  isButtonPressed(keyName: string | string[]) {
    const buttonKeyName = Array.isArray(keyName) ? keyName[0] : keyName;

    return this.keyMap[buttonKeyName]?.isPressed || false;
  }
}
