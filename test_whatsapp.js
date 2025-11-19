const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');

const client = new Client();

client.on('qr', (qr) => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('WhatsApp client is ready!');
    const groupName = "REFLEX"; // Use your test group name
    const message = "Test message with image at: " + new Date().toLocaleString();
    const imagePath = path.join(__dirname, 'image.jpeg');

    try {
        if (!fs.existsSync(imagePath)) {
            console.error(`Image file not found at: ${imagePath}`);
            process.exit(1);
        }
        const media = MessageMedia.fromFilePath(imagePath);
        const chats = await client.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === groupName);

        if (group) {
            await client.sendMessage(group.id._serialized, media, { caption: message });
            console.log(`Test message with image sent to ${groupName}`);
        } else {
            console.error(`Group "${groupName}" not found. Check the exact name.`);
        }
    } catch (error) {
        console.error('Error sending test message:', error);
    }
});

client.initialize();