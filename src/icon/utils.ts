export function loadLink(url: string, className: string) {
  if (!document || !url || typeof url !== 'string') return;

  if (document.querySelectorAll(`.${className}[href="${url}"]`).length > 0) {
    return;
  }

  const link = document.createElement('link');
  link.setAttribute('class', className);
  link.setAttribute('href', url);

  link.setAttribute('rel', 'stylesheet');
  document.head.appendChild(link);
}
