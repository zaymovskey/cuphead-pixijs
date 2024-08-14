import { KeyCode } from '@/engines/KeyboardProcessor/types';

interface keyMapExecuteHandlers {
  executeDown?: () => void;
  executeUp?: () => void;
}

export class KeyboardProcessor {
  private keyMap: {
    [key in KeyCode]?: { handlers: keyMapExecuteHandlers; isPressed: boolean };
  } = {};

  constructor() {
    document.addEventListener('keydown', (ev) =>
      this.onKeyDown(ev.code as KeyCode)
    );
    document.addEventListener('keyup', (ev) =>
      this.onKeyUp(ev.code as KeyCode)
    );
  }

  setButtonsHandlers(
    keyName: KeyCode | KeyCode[],
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

  onKeyDown(key: KeyCode) {
    const button = this.keyMap[key];
    if (!button) return;
    button.isPressed = true;
    button.handlers.executeDown?.();
  }

  onKeyUp(key: KeyCode) {
    const button = this.keyMap[key];
    if (!button) return;
    button.isPressed = false;
    button?.handlers.executeUp?.();
  }

  isButtonPressed(keyName: KeyCode | KeyCode[]) {
    const buttonKeyName = Array.isArray(keyName) ? keyName[0] : keyName;

    return this.keyMap[buttonKeyName]?.isPressed || false;
  }
}
