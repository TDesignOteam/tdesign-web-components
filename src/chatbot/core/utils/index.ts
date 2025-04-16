export function findTargetElement(event: MouseEvent, selector: string | string[]): HTMLElement | null {
  // 统一处理选择器输入格式（支持字符串或数组）
  const selectors = Array.isArray(selector) ? selector : selector.split(',').map((s) => s.trim());

  // 获取事件穿透路径（包含Shadow DOM内部元素）
  const eventPath = event.composedPath();

  // 遍历路径查找目标元素
  for (const el of eventPath) {
    // 类型安全判断 + 多选择器匹配
    if (el instanceof HTMLElement) {
      // 检查是否匹配任意一个选择器
      if (selectors.some((sel) => el.matches?.(sel))) {
        return el; // 找到即返回
      }
    }
  }

  return null; // 未找到返回null
}
