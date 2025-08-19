import { createHash, createCipheriv, createDecipheriv } from 'crypto';
import wordlist from './data/english.json';

// --- Constants ---
const BITS_PER_WORD = 11;
const IV_LENGTH = 16;
const WORD_MAP = new Map(wordlist.map((w, i) => [w, i]));


/**
 * Derives a deterministic key and IV from a PIN using SHA256.
 */
export function getKeyAndIv(pin: string): { key: Buffer; iv: Buffer } {
    const key = createHash('sha256').update(pin).digest();
    const iv = createHash('sha256').update(key).digest().slice(0, IV_LENGTH);
    return { key, iv };
}

/**
 * Encrypts a mnemonic phrase using a PIN with AES-256-CTR.
 */
export function encryptMnemonic(mnemonic: string, pin: string): string {
    const { key, iv } = getKeyAndIv(pin);
    const entropy = mnemonicToEntropy(mnemonic);
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedEntropy = Buffer.concat([cipher.update(entropy), cipher.final()]);
    return entropyToMnemonic(encryptedEntropy);
}

/**
 * Decrypts an encrypted mnemonic phrase using a PIN.
 */
export function decryptMnemonic(encryptedMnemonic: string, pin: string): string {
    const { key, iv } = getKeyAndIv(pin);
    const encryptedEntropy = mnemonicToEntropy(encryptedMnemonic);
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedEntropy = Buffer.concat([decipher.update(encryptedEntropy), decipher.final()]);
    return entropyToMnemonic(decryptedEntropy);
}

// --- Mnemonic/Entropy Conversion ---

function bufferToBits(buffer: Buffer): string {
    return Array.from(buffer).map(byte => byte.toString(2).padStart(8, '0')).join('');
}

/**
 * Converts a mnemonic phrase to its corresponding entropy.
 * @throws {Error} if the mnemonic contains invalid words or has a checksum mismatch.
 */
export function mnemonicToEntropy(mnemonic: string): Buffer {
    const words = mnemonic.trim().split(/\s+/u);
    const bits = words.map(word => {
        const index = WORD_MAP.get(word);
        if (index === undefined) throw new Error(`Invalid mnemonic word: ${word}`);
        return index.toString(2).padStart(BITS_PER_WORD, '0');
    }).join('');

    const checksumLength = bits.length / (32 + 1); // e.g., 128 bits entropy + 4 bits checksum = 132 bits total for 12 words
    const entropyBits = bits.slice(0, -checksumLength);
    const checksumBits = bits.slice(-checksumLength);

    const entropyBytes = new Uint8Array(entropyBits.length / 8);
    for (let i = 0; i < entropyBytes.length; i++) {
        const byteString = entropyBits.slice(i * 8, (i + 1) * 8);
        entropyBytes[i] = parseInt(byteString, 2);
    }
    const entropy = Buffer.from(entropyBytes);

    const hash = createHash('sha256').update(entropy).digest();
    const expectedChecksum = bufferToBits(hash).slice(0, checksumLength);

    if (expectedChecksum !== checksumBits) {
        throw new Error('Invalid mnemonic checksum');
    }

    return entropy;
}

/**
 * Converts entropy (as a Buffer) to a BIP39 mnemonic phrase.
 */
export function entropyToMnemonic(entropy: Buffer): string {
    const entropyBits = bufferToBits(entropy);
    const checksumLength = entropyBits.length / 32;
    const hash = createHash('sha256').update(entropy).digest();
    const checksum = bufferToBits(hash).slice(0, checksumLength);

    const bits = entropyBits + checksum;
    const words: string[] = [];
    for (let i = 0; i < bits.length; i += BITS_PER_WORD) {
        const index = parseInt(bits.slice(i, i + BITS_PER_WORD), 2);
        words.push(wordlist[index]);
    }
    return words.join(' ');
}

