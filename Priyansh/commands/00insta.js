const { downloadVideo } = require('priyansh-all-dl');
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require('tempy');

module.exports.config = {
    name: "igautodownload",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Aman Khan",
    description: "Downloads Instagram videos, photos, reels from any link",
    commandCategory: "utility",
    usages: "[Instagram URL]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "latest",
        "axios": "0.21.1",
        "fs-extra": "10.0.0",
        "tempy": "0.4.0"
    }
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type === "message" && event.body) {
        // Detect all Instagram link formats
        const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv|reels|stories|share)\/([A-Za-z0-9_-]+)/gi;
        const match = event.body.match(instagramRegex);
        
        if (!match) return; // No Instagram link found

        const url = match[0];
        
        try {
            // Send processing message
            api.sendMessage("𝐖𝐀𝐓𝐓𝐈𝐍𝐆.......💥", event.threadID, event.messageID);

            const videoInfo = await downloadVideo(url);
            
            // Check if it's a video or photo
            if (videoInfo.video) {
                // Download Video
                await downloadAndSendMedia(api, event, videoInfo.video, 'mp4', '📹 Video');
            } else if (videoInfo.image) {
                // Download Photo/Image
                await downloadAndSendMedia(api, event, videoInfo.image, 'jpg', '📷 Photo');
            } else if (videoInfo.images && videoInfo.images.length > 0) {
                // Multiple images (Carousel)
                api.sendMessage(`📸 Found ${videoInfo.images.length} images. Downloading...`, event.threadID);
                
                for (let i = 0; i < videoInfo.images.length; i++) {
                    await downloadAndSendMedia(api, event, videoInfo.images[i], 'jpg', `📷 Image ${i + 1}/${videoInfo.images.length}`);
                }
            } else {
                api.sendMessage("❌ Sorry, couldn't extract media from this link. Try another link!", event.threadID, event.messageID);
            }

        } catch (error) {
            console.error('Instagram Download Error:', error);
            
            let errorMessage = "❌ Download failed! ";
            if (error.message.includes('private')) {
                errorMessage += "This account is private.";
            } else if (error.message.includes('not found')) {
                errorMessage += "Content not found or deleted.";
            } else {
                errorMessage += "Please try again or check if the link is valid.";
            }
            
            api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};

// Helper function to download and send media
async function downloadAndSendMedia(api, event, mediaUrl, extension, type) {
    try {
        const response = await axios.get(mediaUrl, { 
            responseType: 'stream',
            timeout: 30000 // 30 second timeout
        });
        
        const tempFilePath = tempy.file({ extension: extension });
        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send the file
        const attachment = fs.createReadStream(tempFilePath);
        await api.sendMessage({
            attachment,
            body: `★━━━━━━━━━━━━━★    💜𝐘𝐞𝐡 𝐋𝐨 𝐀𝐩𝐤𝐚 𝐕𝐢𝐝𝐞𝐨💜★━━━━━━━━━━━━━★`
        }, event.threadID);

        // Clean up
        fs.unlinkSync(tempFilePath);

    } catch (err) {
        console.error("Error in downloadAndSendMedia:", err);
        throw err;
    }
}

module.exports.run = async function ({ api, event }) {
    return api.sendMessage(
        `📥 Instagram Auto Downloader\n\n` +
        `✅ Supported:\n` +
        `• Reels\n` +
        `• Posts (Photo/Video)\n` +
        `• IGTV\n` +
        `• Stories\n` +
        `• Carousel (Multiple Images)\n\n` +
        `Just send any Instagram link!`,
        event.threadID,
        event.messageID
    );
};
