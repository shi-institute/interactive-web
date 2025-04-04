import { inflate } from 'pako';

/**
 * Deserializes a deflated string from a Response object.
 *
 * This function performs the following steps:
 * 1. Fetches the binary compressed file from the Response object.
 * 2. Decompresses the binary data using the `pako.inflate` function.
 * 3. Converts the decompressed binary data back to a UTF-8 string.
 *
 * @param response - The Response object containing the compressed binary data.
 * @returns A promise that resolves to the decompressed UTF-8 string.
 */
export async function deserializeDeflatedString(response: Response) {
  const compressedBinary = new Uint8Array(await response.arrayBuffer());
  const decompressedBinary = inflate(compressedBinary);
  return new TextDecoder().decode(decompressedBinary);
}
