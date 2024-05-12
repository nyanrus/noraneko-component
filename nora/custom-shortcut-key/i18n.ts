import { commands } from "./commands";

export function getFluentLocalization(actionName: string) {
  if (!commands[actionName]) {
    console.error(`actionName(${actionName}) do not exists.`);
    return null;
  }
  //TODO:
  //return `floorp-custom-actions-${commands[actionName][1]}`;
}
