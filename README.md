# BIP39 Mnemonic Encryptor

A simple, secure command-line tool for encrypting and decrypting BIP39 mnemonic phrases using a PIN.

This tool uses AES-256-CTR for encryption, deriving a deterministic key and IV from your PIN to ensure that your mnemonic is securely encrypted and can be reliably decrypted. **The encrypted output is also a valid BIP39 mnemonic.**

## Why Use This Tool?

Storing your mnemonic phrase on paper can be risky. Anyone who sees it can gain access to your crypto assets. This tool provides an extra layer of security by encrypting your mnemonic with a PIN.

Even if someone finds your encrypted mnemonic, they won't be able to access your original wallet without the PIN. Instead, they would unknowingly access a different, empty wallet. This acts as a "honeypot," a cybersecurity technique to deceive and mislead attackers, deterring theft by making them think there are no funds to steal.

## Features

- **Encrypt**: Securely encrypt a 12, 15, 18, 21, or 24-word mnemonic phrase. The encrypted output is also a valid BIP39 mnemonic.
- **Decrypt**: Decrypt a previously encrypted mnemonic to recover the original phrase.
- **Secure**: Uses strong, standard cryptographic libraries (bun `crypto`).
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
Enter your mnemonic phrase: your twelve word mnemonic phrase goes here just like this example please
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
