# Enhanced Server Module 使用文档

## 📋 概述

Enhanced Server Module 是对原有 SSE 服务模块的全面重构，在保持**100%接口兼容**的前提下，显著提升了稳定性、可用性和性能。

## 🔄 无缝迁移

### 替换导入即可完成迁移

```typescript
// 原有代码
import { LLMService } from './server/llmService';

// 新代码 - 只需要修改导入路径
import { LLMService } from './server/enhanced-server';

// 其他代码保持完全不变
const llmService = new LLMService();
const result = await llmService.handleBatchRequest(params, config);
await llmService.handleStreamRequest(params, config);
llmService.closeSSE();
```

## ✨ 主要改进

### 1. **最大等待时间控制**
```typescript
// 防止无限等待，30秒超时
const config = {
  timeout: 30000, // 最大等待时间
  endpoint: 'your-sse-endpoint',
  onMessage: handleMessage,
  onError: handleError,
  onComplete: handleComplete
};
```

### 2. **智能重试机制**
```typescript
// 自动重试配置，指数退避 + 随机抖动
const config = {
  maxRetries: 5,        // 最大重试次数
  retryInterval: 1000,  // 基础重试间隔
  timeout: 30000,
  // ...其他配置
};
```

### 3. **增强错误处理**
```typescript
// 详细的错误信息和分类
config.onError = (error) => {
  console.log('错误类型:', error.name);      // ConnectionError, TimeoutError, ParseError 等
  console.log('错误代码:', error.code);      // CONNECTION_ERROR, TIMEOUT_ERROR 等
  console.log('是否可重试:', error.isRetryable);
  console.log('详细信息:', error.details);
};
```

### 4. **完整事件系统**
```typescript
// 新增可选的监控功能
const llmService = new LLMService();

// 获取连接池指标
const metrics = llmService.getMetrics();
console.log('活跃连接数:', metrics.activeConnections);
console.log('总连接数:', metrics.totalConnections);
console.log('失败连接数:', metrics.failedConnections);

// 获取活跃流信息
const streams = llmService.getActiveStreams();
streams.forEach(stream => {
  console.log('流ID:', stream.id);
  console.log('状态:', stream.status);
  console.log('信息:', stream.info);
});
```

### 5. **资源管理优化**
```typescript
// 完整的资源清理
await llmService.destroy(); // 清理所有连接和资源

// 连接池自动管理，避免重复创建
// 自动清理空闲连接，防止内存泄漏
```

## 🔧 高级配置

### 连接池配置
```typescript
import { createLLMService } from './server/enhanced-server';

const llmService = createLLMService({
  poolConfig: {
    maxConnections: 10,    // 最大连接数
    idleTimeout: 60000,    // 空闲超时（1分钟）
    cleanupInterval: 30000 // 清理间隔（30秒）
  },
  enableDebugLog: true     // 启用调试日志
});
```

### 自定义重试策略
```typescript
const config = {
  endpoint: 'your-endpoint',
  maxRetries: 3,
  retryInterval: 2000,
  timeout: 45000,
  // 自定义重试条件
  retryableErrors: (error) => {
    return error.name === 'NetworkError' || 
           (error.statusCode && error.statusCode >= 500);
  },
  onMessage: handleMessage,
  onError: handleError,
  onComplete: handleComplete
};
```

## 🛡️ 错误处理最佳实践

### 错误类型识别
```typescript
import { 
  ConnectionError, 
  TimeoutError, 
  ParseError, 
  ValidationError 
} from './server/enhanced-server';

config.onError = (error) => {
  if (error instanceof TimeoutError) {
    // 处理超时：可能是网络问题或服务器过载
    console.log('请求超时，请检查网络连接');
  } else if (error instanceof ConnectionError) {
    // 处理连接错误：可能是服务器问题
    console.log('连接失败，服务器可能暂时不可用');
  } else if (error instanceof ParseError) {
    // 处理解析错误：可能是数据格式问题
    console.log('数据解析失败，请联系技术支持');
  } else if (error instanceof ValidationError) {
    // 处理验证错误：通常是配置问题
    console.log('配置错误:', error.message);
  }
};
```

### 重试逻辑控制
```typescript
let retryCount = 0;
const maxManualRetries = 2;

config.onError = (error) => {
  if (error.isRetryable && retryCount < maxManualRetries) {
    retryCount++;
    setTimeout(() => {
      // 手动重试逻辑
      llmService.handleStreamRequest(params, config);
    }, 1000 * retryCount);
  } else {
    // 最终失败处理
    console.error('请求最终失败:', error.message);
  }
};
```

## 📊 性能监控

### 实时监控
```typescript
// 定期检查连接状态
setInterval(() => {
  const metrics = llmService.getMetrics();
  console.log('连接池状态:', {
    active: metrics.activeConnections,
    total: metrics.totalConnections,
    failed: metrics.failedConnections,
    avgTime: metrics.averageConnectionTime
  });
}, 5000);
```

### 异常预警
```typescript
config.onError = (error) => {
  const metrics = llmService.getMetrics();
  
  // 失败率预警
  const failureRate = metrics.failedConnections / metrics.totalConnections;
  if (failureRate > 0.1) { // 失败率超过10%
    console.warn('连接失败率过高:', failureRate);
    // 触发告警机制
  }
  
  // 连接数预警
  if (metrics.activeConnections > 8) { // 接近连接池上限
    console.warn('活跃连接数过多:', metrics.activeConnections);
  }
};
```

## 🔍 调试与故障排除

### 启用详细日志
```typescript
const llmService = createLLMService({
  enableDebugLog: true
});

// 日志输出示例：
// [SSE Debug] Connection sse_1703123456789_abc123 started
// [SSE Info] Connection sse_1703123456789_abc123 established in 250ms
// [SSE Debug] SSE parser reset
```

### 常见问题解决

1. **连接超时**
   ```typescript
   // 增加超时时间或检查网络
   config.timeout = 60000; // 60秒
   ```

2. **频繁重连**
   ```typescript
   // 检查重试配置是否合理
   config.maxRetries = 3;
   config.retryInterval = 5000; // 增加重试间隔
   ```

3. **内存泄漏**
   ```typescript
   // 确保正确清理资源
   window.addEventListener('beforeunload', async () => {
     await llmService.destroy();
   });
   ```

4. **解析错误**
   ```typescript
   // 检查服务器返回的数据格式
   config.validateResponse = (response) => {
     const contentType = response.headers.get('content-type');
     return contentType?.includes('text/event-stream') ?? false;
   };
   ```

## 🚀 性能优化建议

1. **连接复用**：使用连接池避免频繁创建连接
2. **超时设置**：根据实际需求设置合理的超时时间
3. **错误处理**：实现完整的错误处理逻辑
4. **资源清理**：及时清理不需要的连接
5. **监控预警**：实施连接池状态监控

## 📝 迁移检查清单

- [ ] 更新导入语句
- [ ] 添加超时配置
- [ ] 实现错误分类处理
- [ ] 添加资源清理逻辑
- [ ] 配置连接池参数
- [ ] 设置监控和日志
- [ ] 测试重试机制
- [ ] 验证性能改进

## 💡 总结

Enhanced Server Module 通过以下方式显著提升了系统的可用性：

- ✅ **零代码迁移**：保持100%接口兼容
- ✅ **稳定性提升**：完善的错误处理和重试机制  
- ✅ **性能优化**：连接池管理和资源复用
- ✅ **监控支持**：详细的状态监控和指标
- ✅ **内存安全**：自动资源清理和泄漏防护

只需要修改一行导入代码，即可享受所有增强功能！ 