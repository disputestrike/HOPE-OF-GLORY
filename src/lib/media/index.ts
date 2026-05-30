/**
 * @hog/media — Video & audio pipeline primitives for the Hope of Glory workshop.
 *
 *   - TTS narration            (Deepgram Aura)
 *   - Generative scene clips   (Runway Gen-3)
 *   - Composition / overlay    (fluent-ffmpeg, local binary)
 *   - Asset upload             (S3-compatible)
 *
 * Public copy MUST NOT mention provider names. These modules are internal only.
 */
export * from "./src/deepgram-tts";
export * from "./src/runway";
export * from "./src/ffmpeg";
export * from "./src/storage";
