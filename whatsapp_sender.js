const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// ==================== YOUR 3 GROUP IDs (CHANGE THESE) ====================
const groupIds = {
    'Zimbabwe Students Association'         : '120363134775883811@g.us',  // ← change if needed
    'Zimbabwe Business Union'         : '120363188257671934@g.us',      // ← put real ID
    'Zimbabwe Students Association 2' : '120363339586661776@g.us'        // ← put real ID
};
// =========================================================================

const imagePath = path.join(__dirname, 'image.jpeg');
let media;

client.on('qr', (qr) => {
    console.log('================================================');
    console.log('   SCAN THIS QR CODE (ONLY FIRST TIME!)       ');
    console.log('================================================');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ BOT IS LIVE AND RUNNING 24/7 ON INDIAN TIME!');
    console.log('Sending to groups:', Object.keys(groupIds).join(' | '));
    
    if (!fs.existsSync(imagePath)) {
        console.error('❌ image.jpeg not found! Add it and redeploy.');
        process.exit(1);
    }
    media = MessageMedia.fromFilePath(imagePath);
    console.log('✅ Image loaded - daily schedule active');
});

async function sendToAllGroups() {
    const message = `🚀 Send and receive money instantly with Sure_Point Financials!\n\nNo more slow or unreliable transfers — we bring you fast, secure, and affordable money transfers between India, Zimbabwe, South Africa, Zambia, Tanzania, Dubai, and the UK! 🌟💸\n\n• Great value rates\n• 🔒 Secure service\n• ⚡ Instant delivery\n\n📍 Shop #76, Charter & Cameroon, Harare CBD\n📞 +263775846651 | +917681936068 | +916239453749\n\n✨ Sure_Point Financials — where quality service always wins!\n\nSent at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

    console.log(`\n🚀 SENDING NOW → ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);

    for (const [name, id] of Object.entries(groupIds)) {
        try {
            await client.sendMessage(id, media, { caption: message });
            console.log(`   ✅ ${name}`);
        } catch (err) {
            console.error(`   ❌ ${name}:`, err.message);
            try { await client.sendMessage(id, message); console.log(`   📝 Text-only sent to ${name}`); } catch {}
        }
        await new Promise(r => setTimeout(r, 2000)); // avoid ban
    }
    console.log('✅ All groups done\n');
}

// ============ 4 DAILY TIMES (INDIAN STANDARD TIME) ============
cron.schedule('53 13 * * *', sendToAllGroups, { timezone: 'Asia/Kolkata' }); // 1:53 PM
cron.schedule('0 15 * * *',  sendToAllGroups, { timezone: 'Asia/Kolkata' }); // 3:00 PM
cron.schedule('0 18 * * *',  sendToAllGroups, { timezone: 'Asia/Kolkata' }); // 6:00 PM
cron.schedule('0 20 * * *',  sendToAllGroups, { timezone: 'Asia/Kolkata' }); // 8:00 PM

client.on('disconnected', (reason) => console.log('Disconnected:', reason));
client.initialize();
