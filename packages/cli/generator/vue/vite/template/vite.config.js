import { defineConfig } from 'vite';
import path from 'path';
<%_ if(lintOn && lintOn.includes('save')) { _%>
import eslintPlugin from 'vite-plugin-eslint';
<%_ } _%>
<%_ if(vueVersion === '3') { _%>
import vue from '@vitejs/plugin-vue';
<%_ } _%>
<%_ if(vueVersion === '2') { _%>
import { createVuePlugin } from 'vite-plugin-vue2';
<%_ } _%>

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    <%_ if(vueVersion === '3') { _%>
    vue(),
    <%_ } _%>
    <%_ if(vueVersion === '2') { _%>
    createVuePlugin(),
    <%_ } _%>
    <%_ if(lintOn && lintOn.includes('save')) { _%>
    eslintPlugin()
    <%_ } _%>
  ],
  resolve: {
    alias: { '@': path.join(__dirname, 'src') }
  }
});
