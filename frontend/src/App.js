/** @format */

import React from "react"
import { Drizzle } from "../node_modules/@drizzle/store"
import { drizzleReactHooks } from "../node_modules/@drizzle/react-plugin"

import drizzleOptions from "./drizzleOptions"
import LoadingContainer from "./LoadingContainer.js"
import TokenMetadata from "./TokenMetadata.js"
import TokenWallet from "./TokenWallet.js"

const drizzle = new Drizzle(drizzleOptions)
const { DrizzleProvider } = drizzleReactHooks

const App = () => {
	return (
		<div className='container'>
			<h1>ERC20 Token</h1>
			<DrizzleProvider drizzle={drizzle}>
				<LoadingContainer>
					<TokenMetadata />
					<TokenWallet />
				</LoadingContainer>
			</DrizzleProvider>
		</div>
	)
}

export default App
