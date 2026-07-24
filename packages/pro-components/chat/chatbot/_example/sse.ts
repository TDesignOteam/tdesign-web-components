import type { ReferenceItem } from '@tdesign/ai-chat-engine';

export interface DemoSSEPayload {
  type?: string;
  content?: string | ReferenceItem[];
  docs?: ReferenceItem[];
  id?: string;
  msg?: string;
  step?: string;
  title?: string;
}

/** 示例服务端协议；ChatEngine 的 SSE payload 本身允许任意 JSON 值。 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getReferenceItems(value: unknown): ReferenceItem[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const items: ReferenceItem[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.title !== 'string') continue;

    items.push({
      title: item.title,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      type: typeof item.type === 'string' ? item.type : undefined,
      url: typeof item.url === 'string' ? item.url : undefined,
      content: typeof item.content === 'string' ? item.content : undefined,
      site: typeof item.site === 'string' ? item.site : undefined,
      date: typeof item.date === 'string' ? item.date : undefined,
    });
  }
  return items;
}

/** 从 ChatEngine 的通用 JSON 流数据中提取此示例约定的字段。 */
export function getDemoSSEPayload(value: unknown): DemoSSEPayload | undefined {
  if (!isRecord(value)) return undefined;

  return {
    type: typeof value.type === 'string' ? value.type : undefined,
    content: typeof value.content === 'string' ? value.content : getReferenceItems(value.content),
    docs: getReferenceItems(value.docs),
    id: typeof value.id === 'string' ? value.id : undefined,
    msg: typeof value.msg === 'string' ? value.msg : undefined,
    step: typeof value.step === 'string' ? value.step : undefined,
    title: typeof value.title === 'string' ? value.title : undefined,
  };
}

export function parseImageData(value: unknown): { height?: number; name?: string; url?: string; width?: number } {
  if (typeof value !== 'string') return {};

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return {};

    const data = parsed;
    return {
      name: typeof data.name === 'string' ? data.name : undefined,
      url: typeof data.url === 'string' ? data.url : undefined,
      width: typeof data.width === 'number' ? data.width : undefined,
      height: typeof data.height === 'number' ? data.height : undefined,
    };
  } catch {
    return {};
  }
}

export function parseWeatherData(value: unknown): { city: string; conditions?: string; temp: number } {
  if (typeof value !== 'string') return { city: '', temp: 0 };

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return { city: '', temp: 0 };

    const data = parsed;
    return {
      temp: typeof data.temp === 'number' ? data.temp : 0,
      city: typeof data.city === 'string' ? data.city : '',
      conditions: typeof data.conditions === 'string' ? data.conditions : undefined,
    };
  } catch {
    return { city: '', temp: 0 };
  }
}
