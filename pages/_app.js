import "../styles/globals.css"
import "@biconomy/web3-auth/dist/src/style.css"
import { ThirdwebProvider} from "@thirdweb-dev/react"



export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider>
      <Component {...pageProps} />
   </ThirdwebProvider>
  )
}
