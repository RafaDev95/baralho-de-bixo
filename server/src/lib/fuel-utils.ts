import { isB256, hashMessage, Signer } from "fuels";

// Fuel network configuration
export const FUEL_CONFIG = {
	NETWORK_URL:
		process.env.FUEL_NETWORK_URL || "https://beta-5.fuel.network/graphql",
	CHAIN_ID: process.env.FUEL_CHAIN_ID || "0",
};

/**
 * Validate Fuel wallet address format
 */
export const isValidFuelAddress = (address: string): boolean => isB256(address);

export const recoverFuelSignature = async (
	digest: string,
	signature: string,
) => {
	return Signer.recoverAddress(hashMessage(digest), signature).toHexString();
};

/**
 * Verify signature cryptographically using Fuel SDK
 */
export const verifySignature = async (
	address: string,
	signature: string,
	message: string,
): Promise<boolean> => {
	try {
		if (!isValidFuelAddress(address)) return false;
		if (!signature || signature.length < 10) return false;
		if (!message || message.length < 10) return false;

		// Hash the message
		const messageHash = hashMessage(message);

		// Recover the address from the signature
		const recoveredAddress = Signer.recoverAddress(messageHash, signature);

		// Compare
		return recoveredAddress.toString() === address;
	} catch (error) {
		console.error("Signature verification error:", error);
		return false;
	}
};
