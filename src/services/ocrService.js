export const ocrService = {
    scanImage: async (imageUri) => {
        // Mock OCR implementation
        // In a real app, we would upload the image to our backend 
        // or use Google Cloud Vision API / Tesseract.js

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    text: "Transaction Successful\nPaid to: Uber\nAmount: ₹350\nDate: 24 Nov 2025",
                    parsedData: {
                        merchant: "Uber",
                        amount: 350,
                        date: new Date("2025-11-24"),
                        category: "Transportation"
                    }
                });
            }, 2000);
        });
    }
};
