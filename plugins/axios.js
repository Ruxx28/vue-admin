export default function ({ $axios, app}) {
    $axios.onRequest(config => {
        const token =  app.$cookies.get('token')
        config.headers.common['Authorization'] = `Bearer ${token}`;
    })
}
