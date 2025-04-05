import { InitOutput } from "./pkg/spirograph_wasm";

// Store the initialized module and the init promise.
let wasmModule: typeof import("./pkg/spirograph_wasm") | null = null;
let initPromise: Promise<InitOutput> | null = null;

/**
 * Initializes the WASM module if it hasn't been already.
 * Returns the initialized module for use. This is important because if
 * the same module gets initialized multiple times the memory gets clobbered.
 * In the instance of the spirograph it meant that if there were multiple
 * spirographs on the page that each initialized the library they would
 * interact with each other in odd ways (the drawings would end up on another
 * canvas).
 */
export async function initWasm() {
  if (wasmModule) {
    return wasmModule; // Already initialized
  }

  const wasm = await import("./pkg/spirograph_wasm");

  if (!initPromise) {
    // This runs wasm-bindgen's default init function (typically sets up memory, etc.)
    initPromise = wasm.default();
  }

  await initPromise; // Wait for WASM to finish initializing
  wasmModule = wasm; // Store the initialized module

  return wasmModule;
}
