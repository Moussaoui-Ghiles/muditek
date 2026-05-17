function writeOctal(buffer: Buffer, value: number, offset: number, length: number) {
  const text = value.toString(8).padStart(length - 1, "0").slice(-(length - 1)) + "\0";
  buffer.write(text, offset, length, "ascii");
}

function writeString(buffer: Buffer, value: string, offset: number, length: number) {
  buffer.write(value.slice(0, length), offset, length, "utf-8");
}

function tarHeader(name: string, size: number): Buffer {
  const header = Buffer.alloc(512, 0);
  writeString(header, name, 0, 100);
  writeOctal(header, 0o644, 100, 8);
  writeOctal(header, 0, 108, 8);
  writeOctal(header, 0, 116, 8);
  writeOctal(header, size, 124, 12);
  writeOctal(header, Math.floor(Date.now() / 1000), 136, 12);
  header.fill(" ", 148, 156);
  header.write("0", 156, 1, "ascii");
  writeString(header, "ustar", 257, 6);
  writeString(header, "00", 263, 2);

  let checksum = 0;
  for (const byte of header) checksum += byte;
  writeOctal(header, checksum, 148, 8);
  return header;
}

export function createTar(files: Array<{ path: string; data: Buffer }>): Buffer {
  const chunks: Buffer[] = [];
  for (const file of files) {
    chunks.push(tarHeader(file.path, file.data.length));
    chunks.push(file.data);
    const padding = (512 - (file.data.length % 512)) % 512;
    if (padding > 0) chunks.push(Buffer.alloc(padding, 0));
  }
  chunks.push(Buffer.alloc(1024, 0));
  return Buffer.concat(chunks);
}
