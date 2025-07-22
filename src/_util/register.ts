const componentRegistry = new Map<string, () => void>();

export function registerComponent(name: string, registerFn: () => void) {
  componentRegistry.set(name, registerFn);
}

export function registerComponents(componentNames: string[]) {
  componentNames.forEach((name) => {
    const registerFn = componentRegistry.get(name);
    if (registerFn) registerFn();
  });
}
