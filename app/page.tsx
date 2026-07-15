"use client";

import { useMemo, useState } from "react";
import { getResizedImageData, imageDataToAscii } from "@/lib/asciiConverter";

export default function AsciiConverter() {
    const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
    const [width, setWidth] = useState(200);
    const [charSize, setCharSize] = useState(6);
    const [count, setCount] = useState<number>(0);
    const ascii = useMemo(() => {
        if (!sourceImage) return "";

        const imageData = getResizedImageData(sourceImage, width);
        return imageDataToAscii(imageData);
    }, [sourceImage, width]);

    const charCount = ascii.replace(/\n/g, "").length;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            setSourceImage(img);
        };

        img.src = URL.createObjectURL(file);
    }

    return (
        <div className="p-6">
            <div className="max-w-sm w-full mx-auto">
                <label htmlFor="file-input" className="sr-only">Choose file</label>
                <input type="file" accept="image/*" name="file-input" id="file-input" className="block w-full bg-layer border border-layer-line rounded-lg text-sm text-foreground placeholder:text-muted-foreground-1 focus:z-10 focus:outline-hidden focus:border-primary-focus focus:ring-1 focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none file:bg-surface file:border-0 file:me-4 file:py-3 file:px-4" onChange={handleFileChange} />
            </div>

            <div className="flex gap-6 mt-4 w-fit mx-auto sticky top-0 z-10 py-2">
                <label className="flex flex-col gap-1 text-sm">
                    Art width: {width}px
                    <input
                        type="range"
                        min={50}
                        max={1000}
                        step={10}
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                    Font size: {charSize}px
                    <input
                        type="range"
                        min={1}
                        max={32}
                        value={charSize}
                        onChange={(e) => setCharSize(Number(e.target.value))}
                    />
                </label>
            </div>

            <p className="w-fit mx-auto">Character count: {charCount}</p>



            <div className="mt-4 w-fit overflow-auto mx-auto bg-black p-4">
                <pre
                    className="font-mono whitespace-pre text-white inline-block"
                    style={{
                        fontSize: `${charSize}px`,
                        lineHeight: `${charSize * 1.6}px`,
                    }}
                >
                    {ascii}
                </pre>
            </div>
        </div>
    );
}
