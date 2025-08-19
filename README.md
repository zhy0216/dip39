# BIP39 Mnemonic Encryptor

A simple, secure command-line tool for encrypting and decrypting BIP39 mnemonic phrases using a PIN.

This tool uses AES-256-CTR for encryption, deriving a deterministic key and IV from your PIN to ensure that your mnemonic is securely encrypted and can be reliably decrypted.

## Features

- **Encrypt**: Securely encrypt a 12, 15, 18, 21, or 24-word mnemonic phrase.
- **Decrypt**: Decrypt a previously encrypted mnemonic to recover the original phrase.
- **Secure**: Uses strong, standard cryptographic libraries (Node.js `crypto`).
- **Deterministic**: The same mnemonic and PIN will always produce the same encrypted output.

## Prerequisites

- [Bun](https://bun.sh/) must be installed on your system.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd dip39
   ```
3. Install dependencies:
   ```sh
   bun install
   ```

## Usage

To run the interactive CLI, use the following command:

```sh
bun start
```

The tool will prompt you to choose whether to encrypt or decrypt, and then ask for your mnemonic phrase and a PIN.

### Example

```
$ bun start
--- BIP39 Mnemonic Encryptor ---
Choose action [1: Encrypt, 2: Decrypt]: 1
Enter your 12, 15, 18, 21, or 24-word mnemonic phrase: your twelve word mnemonic phrase goes here just like this example please
Enter your PIN: 1234

Processing...
--- Result ---
[encrypted mnemonic will be displayed here]
--------------
```

## Development

### Running Tests

To run the test suite, use:

```sh
bun test
```

### Type Checking

To check for TypeScript errors, run:

```sh
bun run typecheck
```
