# BIP39 Mnemonic Encryptor

A simple, secure command-line tool for encrypting and decrypting BIP39 mnemonic phrases using a PIN. The encrypted output is also a valid BIP39 mnemonic, creating a plausible deniability layer for your assets.

## Features

- **Encrypt & Decrypt**: Supports 12, 15, 18, 21, or 24-word mnemonics.
- **Plausible Deniability**: The encrypted output is a valid but different BIP39 mnemonic. An attacker without the PIN accesses an empty wallet, not your real one.
- **Secure**: Uses the standard and strong `AES-256-CTR` algorithm from Bun's built-in `crypto` module.
- **Deterministic**: The same mnemonic and PIN will always produce the same encrypted output, ensuring you can always recover your original phrase.

## Security Disclaimer

**This tool is provided as-is, without any warranty.** While it adds a strong layer of security, you are responsible for your own digital asset security. 

- **Do NOT forget your PIN**. There is no way to recover it.
- **Do NOT share your PIN or mnemonic phrases** with anyone.
- **Verify your encrypted mnemonic** by decrypting it right after you create it to ensure it works as expected.

## How It Works

This tool transforms your mnemonic into its binary entropy, encrypts it, and then converts the encrypted entropy back into a new, valid mnemonic phrase. Here’s the process:

1.  **Mnemonic to Entropy**: The input mnemonic is converted into its raw binary data (entropy).
2.  **Key & IV Derivation**: A 32-byte encryption key and a 16-byte initialization vector (IV) are deterministically derived from your PIN using `PBKDF2` with `SHA-512`.
3.  **Encryption/Decryption**: The entropy is encrypted or decrypted using `AES-256-CTR`.
4.  **Entropy to Mnemonic**: The resulting binary data is converted back into a valid BIP39 mnemonic phrase.

This deterministic process ensures that your original mnemonic is recoverable only with the correct PIN.

## Prerequisites

- [Bun](https://bun.sh/) must be installed on your system.

## Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/zhy0216/dip39
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd dip39
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

## Usage

This tool runs in an interactive command-line interface. Non-interactive (argument-based) usage is not currently supported.

To start the tool, run:

```sh
bun start
```

The tool will guide you through the encryption or decryption process.

### Example

```sh
$ bun start
--- BIP39 Mnemonic Encryptor ---
Choose action [1: Encrypt, 2: Decrypt]: 1
Enter your mnemonic phrase: your mnemonic phrase goes here just like this example please
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

## License

This project is licensed under the MIT License.
