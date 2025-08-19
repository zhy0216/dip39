import { encryptMnemonic, decryptMnemonic } from './index';

// --- Command-Line Interface (CLI) ---

type ConsoleIterator = AsyncIterator<string, any, undefined>;

async function promptUser(iterator: ConsoleIterator, query: string): Promise<string> {
    // A simple text-based prompt for the console.
    process.stdout.write(query);
    const { value } = await iterator.next();
    return value.trim();
}

async function getMode(iterator: ConsoleIterator): Promise<'encrypt' | 'decrypt'> {
    while (true) {
        const choice = await promptUser(iterator, 'Choose action [1: Encrypt, 2: Decrypt]: ');
        if (choice === '1') return 'encrypt';
        if (choice === '2') return 'decrypt';
        console.log('Invalid choice. Please enter 1 or 2.');
    }
}

async function processMnemonic(phrase: string, pin: string, mode: 'encrypt' | 'decrypt'): Promise<string> {
    const mnemonic = phrase.trim().toLowerCase();
    try {
        return mode === 'encrypt'
            ? encryptMnemonic(mnemonic, pin)
            : decryptMnemonic(mnemonic, pin);
    } catch (error) {
        if (error instanceof Error) {
            // Provide more specific feedback for common errors.
            if (error.message.includes('checksum')) {
                return 'Error: Invalid mnemonic checksum. Please check your mnemonic phrase.';
            } else if (error.message.includes('word')) {
                return `Error: ${error.message}. Please ensure all words are from the BIP39 wordlist.`;
            }
            // For decryption, a generic error is often due to a wrong PIN.
            if (mode === 'decrypt') {
                return 'Error: Decryption failed. The PIN may be incorrect or the mnemonic is invalid.';
            }
        }
        return 'An unknown error occurred during processing.';
    }
}

async function main() {
    console.log('--- BIP39 Mnemonic Encryptor ---');

    const consoleIterator = console[Symbol.asyncIterator]();

    try {
        const mode = await getMode(consoleIterator);
        const mnemonic = await promptUser(consoleIterator, 'Enter your mnemonic phrase: ');
        const pin = await promptUser(consoleIterator, 'Enter your PIN: ');

        console.log('\nProcessing...');
        const result = await processMnemonic(mnemonic, pin, mode);

        console.log('--- Result ---');
        console.log(result);
        console.log('--------------');
    } finally {
        // Ensure the iterator is closed to allow the process to exit.
        consoleIterator.return?.();
    }
}

// This ensures the main function runs only when the script is executed directly.
if (import.meta.main) {
    main().catch(err => {
        console.error('An unexpected error occurred:', err);
        process.exit(1);
    });
}
