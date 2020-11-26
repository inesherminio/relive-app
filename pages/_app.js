// import App from 'next/app'
import { CookiesProvider, useCookies } from 'react-cookie';
import CssBaseline from '@material-ui/core/CssBaseline'
import axios from "axios";

axios.defaults.baseURL = process.env.LOCAL ? 'http://localhost:8080' : 'https://relive-api.herokuapp.com' /*https://relive-api.herokuapp.com*/

axios.interceptors.request.use(async function (response) {
    /* if (!axios.defaults.headers.common['Authorization']) {
        window.location.href = "/login";
    } */
    return response;
}, function (error) {
    return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401)
        /* Go to Login */
        window.location.href = "/login";
    return Promise.reject(error);
});

function MyApp({ Component, pageProps }) {
    const [cookies, setCookie] = useCookies(['token']);

    const token = cookies.token || undefined
    if (token)
        axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

    return <CookiesProvider>
        <CssBaseline />
        <Component {...pageProps} signedIn={token ? true : false} />
    </CookiesProvider>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp