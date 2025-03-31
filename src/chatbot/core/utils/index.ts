export function findTargetElement(event: MouseEvent, selector: string): HTMLElement | null {
  // 获取事件穿透路径（包含Shadow DOM内部元素）
  const eventPath = event.composedPath();

  // 遍历路径查找目标元素
  for (const el of eventPath) {
    // 类型安全判断 + 特征匹配
    if (el instanceof HTMLElement && el.matches?.(selector)) {
      return el; // 找到即返回
    }
  }

  return null; // 未找到返回null
}
