// 组件注册表
export const componentRegistry = new Map<string, { register: () => void; dependencies?: string[] }>();

/**
 * 注册组件
 * @param name 组件名称（如 't-chat-action'）
 * @param registerFn 注册函数
 * @param dependencies 依赖组件列表
 */
export function registerComponent(name: string, registerFn: () => void, dependencies?: string[]) {
  componentRegistry.set(name, { register: registerFn, dependencies });
}

/**
 * 按需注册组件
 * @param componentNames 要注册的组件名称数组
 */
export function registerComponents(componentNames: string[]) {
  const registered = new Set<string>();

  const registerWithDeps = (name: string) => {
    if (registered.has(name)) return;

    const component = componentRegistry.get(name);
    if (!component) {
      console.warn(`Component ${name} not found in registry`);
      return;
    }

    // 先注册依赖
    component?.dependencies?.forEach((dep) => {
      if (!registered.has(dep)) {
        registerWithDeps(dep);
      }
    });

    // 注册组件
    component.register();
    registered.add(name);
    console.log(`Component ${name} registered`);
  };

  componentNames.forEach(registerWithDeps);
}

/**
 * 注册所有组件
 */
export function registerAllComponents() {
  registerComponents([...componentRegistry.keys()]);
}

/**
 * 获取组件的完整依赖树
 * @param componentName 组件名称
 * @returns 依赖树
 */
export function getDependencyTree(componentName: string): string[] {
  const dependencies = new Set<string>();

  const collectDeps = (name: string) => {
    if (dependencies.has(name)) return;

    const component = componentRegistry.get(name);
    if (!component) return;

    dependencies.add(name);
    component.dependencies?.forEach((dep) => collectDeps(dep));
  };

  collectDeps(componentName);
  return Array.from(dependencies);
}

/**
 * 动态加载组件及其依赖
 * @param componentName 组件名称
 */
export async function loadComponentWithDeps(componentName: string, path = '../components') {
  const deps = getDependencyTree(componentName);
  const importPromises = deps.map((dep) => import(`${path}/${dep.replace('t-', '')}`));

  await Promise.all(importPromises);
  registerComponents([componentName]);
}

// 自动暴露到全局
// if (typeof window !== 'undefined') {
//   window.TDesign = window.TDesign || {};
//   window.TDesign.registerComponent = registerComponent;
//   window.TDesign.registerComponents = registerComponents;
//   window.TDesign.registerAllComponents = registerAllComponents;
// }
