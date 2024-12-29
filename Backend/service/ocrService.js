const vision = require('@google-cloud/vision');
const AppError = require('../utils/AppError');

class OCRService {
    constructor() {
        this.client = new vision.ImageAnnotatorClient({
            keyFilename: './api_credential.json'
        });
    }

    async extractTextFromImage(imageBuffer) {
        try {
            const [result] = await this.client.textDetection(imageBuffer);
            const detections = result.textAnnotations;
            
            if (!detections || detections.length === 0) {
                throw new Error('No text detected in the image');
            }
            
            return detections[0].description;
        } catch (error) {
            console.error('Error in OCR processing:', error);
            throw new AppError('Failed to process image', 500);
        }
    }
}

module.exports = new OCRService();