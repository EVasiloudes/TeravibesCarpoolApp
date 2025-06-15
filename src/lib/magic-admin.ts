import { Magic } from '@magic-sdk/admin'

const secretKey = process.env.MAGIC_SECRET_KEY

if (!secretKey) {
  throw new Error('MAGIC_SECRET_KEY environment variable is required')
}

export const magicAdmin = new Magic(secretKey)

export async function validateMagicToken(didToken: string) {
  try {
    // Validate the DID token
    await magicAdmin.token.validate(didToken)
    
    // Get user info from the token
    const metadata = await magicAdmin.users.getMetadataByToken(didToken)
    
    return {
      issuer: metadata.issuer,
      email: metadata.email,
      publicAddress: metadata.publicAddress,
    }
  } catch (error: any) {
    throw new Error(`Magic token validation failed: ${error.message || error.code}`)
  }
}