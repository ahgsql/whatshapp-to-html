# WhatsApp to HTML Converter

A command-line tool to convert WhatsApp chat exports to HTML format.

## Installation

To install the package globally, run:
`npm install -g whatsappchat-to-html`

## Usage

Export a chat history from WhatsApp Mobile App, include media.

Extract that zip file into a folder.

To convert a WhatsApp chat export file to HTML, use the following command:

`whatsapp-to-html <input_file>`

Replace `<input_file>` with the path to your WhatsApp chat export file (typically a `.txt` file).

The tool will generate an `chat.html` file in the same directory as the input file.

## Example

Assuming you have a WhatsApp chat export file named `chat.txt` in the current directory, run:

`whatsapp-to-html chat.txt`

This will create an `chat.html` file in the same directory.

## Features

- Converts WhatsApp chat exports to HTML format
- Supports text messages
- Embeds images and videos directly in the HTML file (encoded as Base64)
- Applies WhatsApp-like styling to the HTML output

## Requirements

- Node.js (>=12.x)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
