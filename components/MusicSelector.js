"use client";
import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export const MUSIC_OPTIONS = [
    {
        id: 'gentle-piano',
        name: 'Gentle Piano',
        url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'
    },
    {
        id: 'peaceful-acoustic',
        name: 'Peaceful Acoustic',
        url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3'
    },
    {
        id: 'nostalgic-strings',
        name: 'Nostalgic Strings',
        url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_c8edc1286d.mp3'
    },
    {
        id: 'soft-memories',
        name: 'Soft Memories',
        url: 'https://cdn.pixabay.com/audio/2022/08/23/audio_2e4b2eb3f7.mp3'
    },
    {
        id: 'warm-guitar',
        name: 'Warm Guitar',
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_d0e57f926d.mp3'
    },
    {
        id: 'dreamy-melody',
        name: 'Dreamy Melody',
        url: 'https://cdn.pixabay.com/audio/2023/06/12/audio_319d08fe8c.mp3'
    },
];

export default function MusicSelector({ selectedMusic, setSelectedMusic }) {
    const [playing, setPlaying] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = (track) => {
        if (playing === track.id) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlaying(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }

            audioRef.current = new Audio(track.url);
            audioRef.current.volume = 0.5;

            audioRef.current.play().catch(error => {
                console.error("Audio playback failed:", error);
                alert("Não foi possível reproduzir o áudio. Tente outro.");
            });

            audioRef.current.onended = () => {
                setPlaying(null);
            };

            setPlaying(track.id);
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MUSIC_OPTIONS.map((track) => (
                    <div
                        key={track.id}
                        onClick={() => setSelectedMusic(track.id)}
                        className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${selectedMusic === track.id
                            ? 'border-violet-500 bg-violet-500/20'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); togglePlay(track); }}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                {playing === track.id ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <span className="font-medium text-sm">{track.name}</span>
                        </div>
                        {selectedMusic === track.id && (
                            <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
