/**
 * Compress an image file to reduce upload time
 * @param {File} file - The image file to compress
 * @param {number} maxSizeMB - Maximum file size in MB (default: 1)
 * @param {number} maxWidthOrHeight - Maximum width or height in pixels (default: 1920)
 * @returns {Promise<File>} Compressed image file
 */
export async function compressImage(file, maxSizeMB = 1, maxWidthOrHeight = 1920) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidthOrHeight) {
                        height = Math.round((height * maxWidthOrHeight) / width);
                        width = maxWidthOrHeight;
                    }
                } else {
                    if (height > maxWidthOrHeight) {
                        width = Math.round((width * maxWidthOrHeight) / height);
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Try different quality levels to meet size requirement
                let quality = 0.9;
                const tryCompress = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }

                        const sizeMB = blob.size / (1024 * 1024);

                        // If still too large and quality can be reduced, try again
                        if (sizeMB > maxSizeMB && quality > 0.5) {
                            quality -= 0.1;
                            tryCompress();
                        } else {
                            // Create a new File from the blob
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        }
                    }, 'image/jpeg', quality);
                };

                tryCompress();
            };

            img.onerror = () => reject(new Error('Failed to load image'));
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}
