require('dotenv').config()
import { resolve } from 'path'
export default {
  loading: false,
  router: {
    middleware: 'auth'
  },
  alias: {
    'components': resolve(__dirname, './components'),
    'pages': resolve(__dirname, './pages')
  },
  target: 'server',
  head: {
    title: process.env.npm_package_name || 'Vườn rau sài gòn',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [ '~/assets/all.scss'],

  plugins: [
    {src: '@/plugins/axios', mode: 'client'},
    '@/plugins/bootstrap-vue',
    '@/plugins/ant-design-vue',
  ],

  components: true,
  
  buildModules: [
    '@nuxtjs/router',
    '@nuxtjs/device',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/moment',
    'cookie-universal-nuxt',
  ],

  serverMiddleware: {
    '/api': '~/api'
  },
  
  server: {
  //  port: 4000, // default: 3000
  //  host: '0.0.0.0' // default: localhost
  },

  build: {
    extend(config, { isDev, isClient }) {
      // ..
      config.module.rules.push({
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader'
      })
      config.module.rules.push({
        test: /\.(png|jpg|gif)$/i,
        use: [{
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },],
      })
      // Sets webpack's mode to development if `isDev` is true.
      if (isDev) {
        config.mode = 'development'
      }
    }
  }
}
