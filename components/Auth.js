import { useState, useEffect, useRef } from "react"
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"
import SmartAccount from "@biconomy/smart-account"
import Link from 'next/link'
import Image from "next/image"
import {
  AiFillTwitterCircle,
  AiFillLinkedin,
  AiFillYoutube,
} from "react-icons/ai"

export default function Home() {
  const [smartAccount, setSmartAccount] = useState(null)
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let configureLogin
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
  }, [interval])

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl(
        "https://social-login-mdqaz1ary-placeparks.vercel.app/"
      )
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MAINNET),
        whitelistUrls: {
          "https://social-login-mdqaz1ary-placeparks.vercel.app/": signature1
        }
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      // sdkRef.current.showConnectModal()
      sdkRef.current.showWallet()
      enableInterval(true)
    } else {
      setupSmartAccount()
    }
  }
  
  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    setLoading(true)
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    )
    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MAINNET,
        supportedNetworksIds: [ChainId.POLYGON_MAINNET]
      })
      await smartAccount.init()
      setSmartAccount(smartAccount)
      setLoading(false)
    } catch (err) {
      console.log("error setting up smart account... ", err)
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.")
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    setSmartAccount(null)
    enableInterval(false)
  }

  return (
    <div >
     <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70  "></div>
     <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 "></div>
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 "></div>
    <div className="absolute -bottom-8 right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 "></div>
      <h1 class="text-front">WELCOME TO MIRAC.ETH WEBSITE</h1>
      {!smartAccount && !loading && (
        <button className="mt-10 ml-4 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-md px-5 py-2.5 text-center ml-80 w-40 mb-2 sm:ml-96" onClick={login}>
          Login
        </button>
      )}

      {loading && <p class="para">Loading account details...</p>}


  {!!smartAccount && (
   
   <div  class="smart-account">
     <h3>Smart account address:</h3>
     <p>{smartAccount.address}</p>
     <button class="btn-logout" onClick={logout}>
       Logout
     </button>
     {smartAccount.address && (<a target="_blank" href="https://ipfs-dapp-wine.vercel.app/mint" rel="noopener noreferrer"><button class="btn-mint">Go to Mint page</button></a> )}
     <div >
     {smartAccount.address && (<a target="_blank" href="/gallery"><button class="btn-gallery" rel="noopener noreferrer">Nft Gallery</button></a> )}
     {smartAccount.address && (<a target="_blank" href="https://ipfs-dapp-wine.vercel.app/"><button class="btn-ipfs" rel="noopener noreferrer">Ipfs Drop</button></a> )}
     </div>
     {smartAccount.address && (<Link href="/"><button class="btn-home">Home</button></Link> )}

</div>
   
   )}
        <div class="footer">Developed by Mirac.eth </div>
      </div>
  )
}
