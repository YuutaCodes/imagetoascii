"use client";

import { useMemo, useState } from "react";
import { getResizedImageData, imageDataToAscii } from "@/lib/asciiConverter";
import { Check, Copy, Upload } from "lucide-react";

export default function AsciiConverter() {
    const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
    const [width, setWidth] = useState(200);
    const [charSize, setCharSize] = useState(8);
    const [invert, setInvert] = useState(false);
    const [copied, setCopied] = useState(false);

    const ascii = useMemo(() => {
        if (!sourceImage) return "";
        const imageData = getResizedImageData(sourceImage, width);
        return imageDataToAscii(imageData, invert);
    }, [sourceImage, width, invert]);

    const charCount = ascii.replace(/\n/g, "").length;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const img = new Image();
        img.onload = () => setSourceImage(img);
        img.src = URL.createObjectURL(file);
    }

    async function copyToClipboard() {
        await navigator.clipboard.writeText(ascii);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">Image to ASCII</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Upload an image and tune it into ASCII art.
                    </p>
                </header>

                <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <label
                        htmlFor="file-input"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
                    >
                        <Upload size={18} />
                        {sourceImage ? "Choose a different image" : "Choose an image"}
                        <input
                            type="file"
                            accept="image/*"
                            name="file-input"
                            id="file-input"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </label>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <label className="flex flex-col gap-1.5 text-sm">
                            <span className="text-neutral-600 dark:text-neutral-300">Width: {width}px</span>
                            <input
                                type="range"
                                min={50}
                                max={1200}
                                step={10}
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="accent-neutral-800 dark:accent-neutral-200"
                            />
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm">
                            <span className="text-neutral-600 dark:text-neutral-300">Font size: {charSize}px</span>
                            <input
                                type="range"
                                min={1}
                                max={20}
                                value={charSize}
                                onChange={(e) => setCharSize(Number(e.target.value))}
                                className="accent-neutral-800 dark:accent-neutral-200"
                            />
                        </label>

                        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                            <input
                                type="checkbox"
                                checked={invert}
                                onChange={(e) => setInvert(e.target.checked)}
                                className="h-4 w-4 accent-neutral-800 dark:accent-neutral-200"
                            />
                            Invert
                        </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
                        <span className="text-neutral-500 dark:text-neutral-400">
                            {charCount.toLocaleString()} characters
                        </span>
                        <button
                            onClick={copyToClipboard}
                            disabled={!ascii}
                            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>

                <section className="overflow-auto rounded-xl border border-neutral-200 bg-black dark:border-neutral-800">
                    <pre
                        className="p-4 font-mono leading-none whitespace-pre text-neutral-100"
                        style={{ fontSize: `${charSize}px`, lineHeight: `${charSize * 1.4}px` }}
                    >
                        {ascii || "Upload an image to see ASCII output here."}
                    </pre>
                </section>
            </main>
        </div>
    );
}
