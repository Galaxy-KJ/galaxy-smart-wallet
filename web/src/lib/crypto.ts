import { openDB } from "idb"

const DB_NAME = "wallet-db"
const STORE_NAME = "encrypted-wallet"

/**
 * Encrypts a private key using password-based encryption with enhanced security measures
 * 
 * SECURITY LIMITATION WARNING:
 * Both the secretKey and password parameters are JavaScript strings, which are IMMUTABLE
 * and CANNOT be securely wiped from memory. Despite the clearing of Uint8Array buffers
 * in the finally block, the original string data may persist in memory until garbage
 * collection occurs, and even then, memory may not be immediately overwritten.
 * 
 * SECURITY IMPLICATIONS:
 * - Original string parameters remain in memory as immutable data
 * - Memory dumps could potentially expose sensitive data
 * - Garbage collection timing is not guaranteed
 * - Swap files may contain sensitive data
 * 
 * RECOMMENDATIONS:
 * - Only use in secure, trusted environments
 * - Avoid shared or potentially compromised systems
 * - Consider the entire application lifecycle for security planning
 * - Implement additional application-level security measures
 * 
 * @param secretKey - Private key to encrypt (WARNING: immutable string, cannot be securely wiped)
 * @param password - Password for encryption (WARNING: immutable string, cannot be securely wiped) 
 * @returns Promise resolving to encrypted data as JSON string
 */
export async function encryptPrivateKey(secretKey: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  
  let keyMaterial: CryptoKey | null = null
  let derivedKey: CryptoKey | null = null
  let ciphertext: ArrayBuffer | null = null
  let passwordBytes: Uint8Array | null = null
  let secretKeyBytes: Uint8Array | null = null

  try {
    passwordBytes = enc.encode(password)
    secretKeyBytes = enc.encode(secretKey)
    
    keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      passwordBytes,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    )

    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    )

    ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      secretKeyBytes
    )

    const encryptedData = {
      ciphertext: Array.from(new Uint8Array(ciphertext)),
      salt: Array.from(salt),
      iv: Array.from(iv),
    }

    return JSON.stringify(encryptedData)
  } finally {
    // NOTE: These buffer clearing operations provide limited security benefit
    // because the original string parameters (password, secretKey) remain
    // in memory as immutable data and cannot be securely wiped
    if (passwordBytes) {
      passwordBytes.fill(0)
    }
    
    if (secretKeyBytes) {
      secretKeyBytes.fill(0)
    }
    
    if (ciphertext) {
      new Uint8Array(ciphertext).fill(0)
    }
    
    keyMaterial = null
    derivedKey = null
    ciphertext = null
    
    // Attempt garbage collection - timing not guaranteed
    if (typeof global !== 'undefined' && global.gc) {
      global.gc()
    }
  }
}

export async function saveEncryptedWallet(encrypted: string) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        })
        // Create any indexes if needed
        store.createIndex("wallet", "wallet", { unique: false })
      }
    },
  })
  
  // Store the encrypted wallet data with the proper structure
  const walletData = {
    wallet: encrypted,
    createdAt: new Date().toISOString()
  }
  
  await db.put(STORE_NAME, walletData)
}

export async function getEncryptedWallet(): Promise<string | null> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        })
        // Create any indexes if needed
        store.createIndex("wallet", "wallet", { unique: false })
      }
    },
  })
  
  const wallets = await db.getAll(STORE_NAME)
  
  if (!wallets || wallets.length === 0) {
    return null
  }
  
  // Return the first wallet's encrypted data
  return wallets[0].wallet
}

/**
 * Decrypts a private key using password-based decryption with security limitations
 * 
 * SECURITY LIMITATION WARNING:
 * The password parameter is a JavaScript string, which is IMMUTABLE and CANNOT be 
 * securely wiped from memory. Despite clearing Uint8Array buffers in the finally 
 * block, the original password string may persist in memory until garbage collection
 * occurs, and memory may not be immediately overwritten.
 * 
 * ADDITIONAL SECURITY CONCERNS:
 * - The decrypted private key is returned as a string, creating another immutable
 *   copy in memory that cannot be securely wiped
 * - Both input and output sensitive data remain in memory as immutable strings
 * - Memory dumps could potentially expose both encrypted keys and passwords
 * 
 * SECURITY IMPLICATIONS:
 * - Original password parameter remains in memory as immutable data
 * - Returned private key string cannot be securely wiped by caller
 * - Multiple copies of sensitive data may exist in memory simultaneously
 * - Timing of garbage collection is not guaranteed
 * 
 * RECOMMENDATIONS:
 * - Only use in secure, trusted environments
 * - Minimize the lifetime of returned private key data
 * - Consider the entire application security model
 * - Implement additional safeguards at the application level
 * 
 * @param encryptedStr - Encrypted private key data as JSON string
 * @param password - Password for decryption (WARNING: immutable string, cannot be securely wiped)
 * @returns Promise resolving to decrypted private key (WARNING: immutable string, cannot be securely wiped)
 */
export async function decryptPrivateKey(encryptedStr: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const dec = new TextDecoder()
  
  let keyMaterial: CryptoKey | null = null
  let derivedKey: CryptoKey | null = null
  let decrypted: ArrayBuffer | null = null
  let passwordBytes: Uint8Array | null = null

  try {
    const encrypted = JSON.parse(encryptedStr)
    const salt = new Uint8Array(encrypted.salt)
    const iv = new Uint8Array(encrypted.iv)
    const data = new Uint8Array(encrypted.ciphertext)

    passwordBytes = enc.encode(password)
    keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      passwordBytes,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    )

    derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    )

    decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      data
    )

    return dec.decode(decrypted)
  } finally {
    // NOTE: These buffer clearing operations provide limited security benefit
    // because the original password string parameter remains in memory as
    // immutable data and cannot be securely wiped. Additionally, the returned
    // private key string will also be immutable and cannot be wiped by the caller.
    if (passwordBytes) {
      passwordBytes.fill(0)
    }
    
    if (decrypted) {
      new Uint8Array(decrypted).fill(0)
    }
    
    keyMaterial = null
    derivedKey = null
    decrypted = null
    
    // Attempt garbage collection - timing not guaranteed
    if (typeof global !== 'undefined' && global.gc) {
      global.gc()
    }
  }
}
