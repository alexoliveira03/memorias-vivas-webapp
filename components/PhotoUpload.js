"use client";
import { useState, useCallback } from 'react';
import { Upload, X, Plus } from 'lucide-react';

export default function PhotoUpload({ images, setImages, maxImages = 10 }) {
    const [dragActive, setDragActive] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleFiles = useCallback((files) => {
        const newImages = [...images];
        for (let i = 0; i < files.length; i++) {
            if (newImages.length >= maxImages) break;
            const file = files[i];
            if (file.type.startsWith('image/')) {
                newImages.push({
                    file,
                    preview: URL.createObjectURL(file)
                });
            }
        }
        setImages(newImages);
    }, [images, maxImages, setImages]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDropReorder = (e, dropIndex) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            const newImages = [...images];
            const draggedItem = newImages[draggedIndex];

            newImages.splice(draggedIndex, 1);
            newImages.splice(dropIndex, 0, draggedItem);

            setImages(newImages);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="w-full">
            <div
                className={`relative h-56 rounded-2xl border-2 border-dashed transition-all ${dragActive
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {images.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 p-3 h-full overflow-y-auto">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDropReorder(e, idx)}
                                className={`relative aspect-square rounded-lg overflow-hidden group bg-black/50 border-2 transition-all cursor-move ${draggedIndex === idx
                                    ? 'opacity-50 scale-95 border-violet-500'
                                    : dragOverIndex === idx
                                        ? 'border-violet-400 scale-105 shadow-lg shadow-violet-500/50'
                                        : 'border-white/10'
                                    } hover:border-violet-500/50`}
                            >
                                <img
                                    src={img.preview}
                                    alt="Upload"
                                    className="w-full h-full object-cover select-none"
                                    draggable={false}
                                />

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeImage(idx);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDragStart={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="absolute top-1 right-1 p-1.5 rounded-full bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>

                                {/* Number Badge */}
                                <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-medium border border-white/20 pointer-events-none select-none">
                                    #{idx + 1}
                                </div>
                            </div>
                        ))}
                        {images.length < maxImages && (
                            <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg text-gray-500 hover:border-violet-500/50 hover:text-violet-400 transition-all cursor-pointer aspect-square">
                                <Plus size={24} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400 pointer-events-none">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                            <Upload size={28} className="text-violet-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-white mb-1">Drag & drop or click to upload</p>
                            <p className="text-xs text-gray-500">JPG, PNG, WEBP • Max 10MB each</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
