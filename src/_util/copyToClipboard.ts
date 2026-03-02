export function copy(text: string) {
  let success: boolean;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    success = true;
  } catch (e) {
    console.error('fallback 复制失败', e);
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}
