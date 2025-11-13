# src/api 目录优化方案

## 现状分析

1. **结构松散**：api.ts 和 upack.ts 分别创建不同的 RequestHttp 实例，缺乏统一管理
2. **类型集中**：所有接口类型定义在一个文件中，不便于维护
3. **模块组织**：modules 目录下的文件组织不够清晰，存在示例目录 eg_proTable
4. **功能冗余**：部分功能实现可以进一步优化和整合

## 优化建议

### 1. 目录结构优化

```
src/api/
├── core/              # 核心功能
│   ├── index.ts       # 统一出口
│   ├── axios.ts       # Axios 二次封装
│   └── interceptors/  # 拦截器
│       ├── request.ts # 请求拦截器
│       └── response.ts # 响应拦截器
├── modules/           # 业务模块
│   ├── auth/          # 认证相关
│   │   ├── index.ts
│   │   └── types.ts
│   ├── system/        # 系统管理
│   │   ├── index.ts
│   │   └── types.ts
│   └── ...
├── utils/             # 工具函数
│   ├── checkStatus.ts
│   ├── axiosCancel.ts
│   └── ...
└── types/             # 公共类型定义
    └── index.ts
```

### 2. 功能优化

- 统一 HTTP 实例管理，支持多环境配置
- 按模块拆分类型定义
- 增强错误处理机制
- 增加 API 文档和注释
- 优化请求方法封装

### 3. 实现步骤

1. 创建新的目录结构
2. 重构核心功能
3. 迁移和重构业务模块
4. 更新类型定义
5. 优化工具函数
6. 更新引用路径
