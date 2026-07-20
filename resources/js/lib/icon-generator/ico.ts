/** Build a multi-size ICO (PNG-compressed entries) for modern browsers. */

function pngToIco(pngBuffers: ArrayBuffer[]): Blob {
    const count = pngBuffers.length;
    const headerSize = 6 + count * 16;
    let offset = headerSize;
    const entries: { width: number; height: number; size: number; offset: number; data: Uint8Array }[] =
        [];

    for (const buffer of pngBuffers) {
        const data = new Uint8Array(buffer);
        const view = new DataView(buffer);
        // IHDR starts at byte 16 in a standard PNG
        const width = view.getUint32(16);
        const height = view.getUint32(20);
        entries.push({
            width: width >= 256 ? 0 : width,
            height: height >= 256 ? 0 : height,
            size: data.byteLength,
            offset,
            data,
        });
        offset += data.byteLength;
    }

    const out = new Uint8Array(offset);
    const outView = new DataView(out.buffer);

    // ICONDIR
    outView.setUint16(0, 0, true);
    outView.setUint16(2, 1, true); // ICO
    outView.setUint16(4, count, true);

    let dirOffset = 6;
    for (const entry of entries) {
        out[dirOffset] = entry.width;
        out[dirOffset + 1] = entry.height;
        out[dirOffset + 2] = 0;
        out[dirOffset + 3] = 0;
        outView.setUint16(dirOffset + 4, 1, true); // planes
        outView.setUint16(dirOffset + 6, 32, true); // bit count
        outView.setUint32(dirOffset + 8, entry.size, true);
        outView.setUint32(dirOffset + 12, entry.offset, true);
        dirOffset += 16;
    }

    for (const entry of entries) {
        out.set(entry.data, entry.offset);
    }

    return new Blob([out], { type: 'image/x-icon' });
}

export async function buildFaviconIco(pngBlobs: Blob[]): Promise<Blob> {
    const buffers = await Promise.all(pngBlobs.map((b) => b.arrayBuffer()));

    return pngToIco(buffers);
}
