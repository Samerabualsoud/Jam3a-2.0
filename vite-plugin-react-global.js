// vite-plugin-react-global.js
export default function reactGlobalPlugin() {
  return {
    name: 'vite-plugin-react-global',
    transformIndexHtml(html) {
      // Add a script tag to define React globally before any other scripts run
      return html.replace(
        '<head>',
        `<head>
        <script>
          window.process = window.process || { env: { NODE_ENV: 'production' } };
          window.global = window;
        </script>`
      );
    },
    config(config) {
      // Ensure React is properly externalized and handled
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = [
        ...(config.optimizeDeps.include || []),
        'react',
        'react-dom',
        'react/jsx-runtime'
      ];
      
      // Ensure proper build options
      config.build = config.build || {};
      config.build.commonjsOptions = {
        ...(config.build.commonjsOptions || {}),
        transformMixedEsModules: true
      };
      
      return config;
    }
  };
}
