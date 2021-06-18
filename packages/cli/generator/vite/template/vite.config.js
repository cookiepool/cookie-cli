import { defineConfig } from 'vite';
<%_ if(vueVersion === '3') { _%>
import vue from '@vitejs/plugin-vue';
<%_ } _%>
<%_ if(vueVersion === '2') { _%>
import { createVuePlugin } from 'vite-plugin-vue2'
<%_ } _%>

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    <%_ if(vueVersion === '3') { _%>
    vue()
    <%_ } _%>
    <%_ if(vueVersion === '2') { _%>
    createVuePlugin()
    <%_ } _%>
  ]
});
