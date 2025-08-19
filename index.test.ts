import { test, expect } from 'bun:test';
import { getKeyAndIv, mnemonicToEntropy, entropyToMnemonic, encryptMnemonic, decryptMnemonic } from './index';

test('getKeyAndIv derives a deterministic key and IV', () => {
    const testPin = '1234';
    const { key, iv } = getKeyAndIv(testPin);

    // Check lengths
    expect(key.length).toBe(32);
    expect(iv.length).toBe(16);

    // Check for determinism
    const { key: key2, iv: iv2 } = getKeyAndIv(testPin);
    expect(key).toEqual(key2);
    expect(iv).toEqual(iv2);

    // Check that different PINs produce different keys/IVs
    const { key: key3, iv: iv3 } = getKeyAndIv('4321');
    expect(key).not.toEqual(key3);
    expect(iv).not.toEqual(iv3);
});

test('mnemonicToEntropy and entropyToMnemonic are reversible', () => {
    const testEntropy = Buffer.from('1a2b3c4d5e6f78901a2b3c4d5e6f7890', 'hex');
    const testMnemonic = entropyToMnemonic(testEntropy);
    const entropy = mnemonicToEntropy(testMnemonic);
    expect(entropy).toBeInstanceOf(Buffer);
    expect(entropy.length).toBe(16); // 12 words = 128 bits = 16 bytes

    const regeneratedMnemonic = entropyToMnemonic(entropy);
    expect(regeneratedMnemonic).toBe(testMnemonic);
});

test('encryptMnemonic and decryptMnemonic work correctly', () => {
    const testEntropy = Buffer.from('1a2b3c4d5e6f78901a2b3c4d5e6f7890', 'hex');
    const testMnemonic = entropyToMnemonic(testEntropy);
    const testPin = '1234';

    // Encrypt the mnemonic
    const encryptedMnemonic = encryptMnemonic(testMnemonic, testPin);

    // It should not be the same as the original
    expect(encryptedMnemonic).not.toBe(testMnemonic);

    // It should be a valid 12-word mnemonic
    expect(encryptedMnemonic.split(' ').length).toBe(12);

    // Decrypt it back
    const decryptedMnemonic = decryptMnemonic(encryptedMnemonic, testPin);

    // It should match the original mnemonic
    expect(decryptedMnemonic).toBe(testMnemonic);
});

test('decryptMnemonic fails with the wrong PIN', () => {
    const testEntropy = Buffer.from('1a2b3c4d5e6f78901a2b3c4d5e6f7890', 'hex');
    const testMnemonic = entropyToMnemonic(testEntropy);
    const testPin = '1234';
    const encryptedMnemonic = encryptMnemonic(testMnemonic, testPin);
    const wrongPin = '4321';

    // Decrypting with the wrong PIN should produce a different (garbage) mnemonic
    const decryptedMnemonicWithWrongPin = decryptMnemonic(encryptedMnemonic, wrongPin);
    expect(decryptedMnemonicWithWrongPin).not.toBe(testMnemonic);
});
