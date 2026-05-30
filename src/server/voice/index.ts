/**
 * Hope Line runtime — SignalWire AI voice agent.
 *
 * THIS FILE HANDLES HUMAN LIVES. EDIT WITH EXTREME CARE.
 *
 * Architecture:
 *   1. Inbound call → SignalWire webhook (/api/voice/inbound)
 *   2. AI disclosure greeting via Deepgram TTS
 *   3. Each turn: STT → crisis classify → route → TTS
 *   4. Imminent risk (means + plan + timeline) → warm transfer to 988 + 911
 *   5. Active risk (suicidal ideation, abuse, child danger) → warm transfer to 988
 *   6. Full transcript stored to call_turns, reviewed within 24h
 *   7. Raw phone never stored — only SHA-256 caller_hash
 */
console.log("[voice] Hope Line runtime ready. Inbound calls routed via /api/voice/inbound.");
console.log("[voice] Crisis Agent ALWAYS uses Claude. Never Cerebras. This is locked.");
