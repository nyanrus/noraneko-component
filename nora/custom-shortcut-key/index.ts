import { commands } from "./commands";
import type { CSKData } from "./defines";
import { checkIsSystemShortcut } from "./utils";

export class CustomShortcutKey {
  private static instance: CustomShortcutKey;
  private static windows: Window[] = [];

  //this boolean disable shortcut of csk
  //useful for registering
  disable_csk = false;
  static getInstance() {
    if (!CustomShortcutKey.instance) {
      CustomShortcutKey.instance = new CustomShortcutKey();
    }
    if (!CustomShortcutKey.windows.includes(window)) {
      CustomShortcutKey.instance.startHandleShortcut(window);
      CustomShortcutKey.windows.push(window);
      console.log("add window");
    }
    return CustomShortcutKey.instance;
  }

  cskData: CSKData = [];
  private constructor() {
    this.initCSKData();

    console.warn("CSK Init Completed");
  }

  private initCSKData() {
    this.cskData = {
      "gecko-open-new-window": {
        modifiers: {
          ctrl: true,
          shift: true,
          alt: false,
          meta: false,
        },
        key: "V",
      },
    };
  }
  private startHandleShortcut(_window: Window) {
    _window.addEventListener("keydown", (ev) => {
      if (this.disable_csk) {
        console.log("disable-csk");
        return;
      }
      if (
        //@ts-expect-error
        ["Control", "Alt", "Meta", "Shift"].filter((k) => ev.key.includes(k))
          .length === 0
      ) {
        if (checkIsSystemShortcut(ev)) {
          console.warn(`This Event is registered in System: ${ev}`);
          return;
        }

        for (const [key, shortcutDatum] of Object.entries(this.cskData)) {
          const { alt, ctrl, meta, shift } = shortcutDatum.modifiers;
          if (
            //@ts-expect-error
            ev.altKey === alt &&
            //@ts-expect-error
            ev.ctrlKey === ctrl &&
            //@ts-expect-error
            ev.metaKey === meta &&
            //@ts-expect-error
            ev.shiftKey === shift &&
            //@ts-expect-error
            ev.key === shortcutDatum.key
          ) {
            commands[key].command(ev);
          }
        }
      }
    });
  }
}
