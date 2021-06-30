import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
<%_ if(lintOn && lintOn.includes('save')) { _%>
import eslintPlugin from 'vite-plugin-eslint';
<%_ } _%>

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), <%_ if(lintOn && lintOn.includes('save')) { _%>eslintPlugin()<%_ } _%>],
  resolve: {
    alias: { '@': path.join(__dirname, 'src') }
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]--[hash:base64:5]'
    }
  }
});
