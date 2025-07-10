import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 确保文件名不包含 hash，便于 CEP 插件引用
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        // 生成传统格式而不是ES6模块，兼容CEP环境
        format: 'iife',
        // 设置全局变量名
        name: 'IllustratorQuotePlugin'
      }
    },
    // 禁用代码压缩以便调试
    minify: false,
    // 生成 source map 便于调试
    sourcemap: true,
    // 设置目标为CEP支持的版本
    target: 'es2015'
  },
  server: {
    port: 3000,
    host: true
  },
  base: './',
  define: {
    // 定义全局变量以便在 CEP 环境中使用
    __CEP_PLUGIN__: true
  }
})
