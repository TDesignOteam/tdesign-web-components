function messageMethod(...v) {
  console.log(...v);
}

export const MessagePlugin = (theme, message, duration) => messageMethod(theme, message, duration);
MessagePlugin.info = (content, duration?) => messageMethod('info', content, duration);
MessagePlugin.error = (content, duration?) => messageMethod('error', content, duration);
MessagePlugin.warning = (content, duration?) => messageMethod('warning', content, duration);
MessagePlugin.success = (content, duration?) => messageMethod('success', content, duration);
MessagePlugin.question = (content, duration?) => messageMethod('question', content, duration);
MessagePlugin.loading = (content, duration?) => messageMethod('loading', content, duration);
