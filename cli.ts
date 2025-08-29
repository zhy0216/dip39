import { encryptMnemonic, decryptMnemonic, generateMnemonic } from './index';

// --- Command-Line Interface (CLI) ---

type ConsoleIterator = AsyncIterator<string, any, undefined>;

async function promptUser(iterator: ConsoleIterator, query: string): Promise<string> {
    // A simple text-based prompt for the console.
    process.stdout.write(query);
    const { value } = await iterator.next();
    return value.trim();
}

async function getMode(iterator: ConsoleIterator): Promise<'encrypt' | 'decrypt' | 'autogen'> {
    while (true) {
        const choice = await promptUser(iterator, 'Choose action [1: Encrypt, 2: Decrypt, 3: Autogen]: ');
        if (choice === '1') return 'encrypt';
        if (choice === '2') return 'decrypt';
        if (choice === '3') return 'autogen';
        console.log('Invalid choice. Please enter 1, 2, or 3.');
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
        
        if (mode === 'autogen') {
            // Handle autogen mode
            const entropyChoice = await promptUser(consoleIterator, 'Choose entropy length [1: 12 words, 2: 15 words, 3: 18 words, 4: 21 words, 5: 24 words]: ');
            let entropyLength = 16; // Default to 12 words
            
            switch (entropyChoice) {
                case '1': entropyLength = 16; break; // 12 words
                case '2': entropyLength = 20; break; // 15 words
                case '3': entropyLength = 24; break; // 18 words
                case '4': entropyLength = 28; break; // 21 words
                case '5': entropyLength = 32; break; // 24 words
                default: 
                    console.log('Invalid choice. Using default 12 words.');
                    entropyLength = 16;
            }
            
            console.log('\nGenerating mnemonic...');
            const generatedMnemonic = generateMnemonic(entropyLength);
            
            console.log('--- Generated Mnemonic ---');
            console.log(generatedMnemonic);
            console.log('-------------------------');
        } else {
            // Handle encrypt/decrypt modes
            const mnemonic = await promptUser(consoleIterator, 'Enter your mnemonic phrase: ');
            const pin = await promptUser(consoleIterator, 'Enter your PIN: ');

            console.log('\nProcessing...');
            const result = await processMnemonic(mnemonic, pin, mode);

            console.log('--- Result ---');
            console.log(result);
            console.log('--------------');
        }
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
