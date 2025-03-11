// src/pages/_app.js
import '../../styles/global.css'
import '../../styles/components.css'
import '../../styles/themes.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp