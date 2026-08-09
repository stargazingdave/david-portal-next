import CodeSnippet from "./code-snippet";
import {
    GuideFigure as Fig,
    GuideHeading as SectionHeader,
    GuideList as SectionList,
    GuideParagraph as SectionParagraph,
} from "./guide-elements";

export default function SoftwareSetupGuide() {
    return (
        <div className="flex flex-col items-center p-6 space-y-6">
            <header className="text-center">
                <h1 className="text-4xl font-bold mb-2">IntercomD - Software Setup</h1>
                <p className="text-lg text-secondary-foreground">
                    The code flashed onto the ESP32, with explanations for each section.
                </p>
            </header>

            <main className="max-w-4xl w-full">
                {/* Wrap prose once for consistent typography */}
                <div className="prose dark:prose-invert">
                    {/* INTRO */}
                    <section aria-labelledby="intro">
                        <SectionHeader id="intro">Overview</SectionHeader>
                        <SectionParagraph>
                            A walkie-station sketch for ESP32 using I2S (full-duplex) and ESP-NOW. In idle (PTT up), the device
                            receives and plays audio. When PTT is pressed, it sends a short silent preroll and then streams mic audio.
                            A jitter buffer smooths network jitter, with a simple IDLE → PREROLL → PLAY state machine on RX.
                        </SectionParagraph>
                        <SectionList>
                            <li>Sample rate: 16 kHz; <code>FRAMES=128</code> (~8 ms per frame).</li>
                            <li>LEDs: TX (GPIO13), RX-active (GPIO26), LINK-alive (GPIO23).</li>
                            <li>Keepalive: lightweight PING/PONG to show link status without a router.</li>
                            <li>No prints for clean timing; tune pins/channel for your board and environment.</li>
                        </SectionList>
                    </section>

                    {/* IMPORTS */}
                    <section aria-labelledby="imports">
                        <SectionHeader id="imports">Imports</SectionHeader>
                        <Fig caption="Headers for Arduino core, Wi-Fi/ESP-NOW, and I2S driver.">
                            <CodeSnippet
                                language="c"
                                title="Imports"
                                code={`
                                    #include <Arduino.h>
                                    #include <WiFi.h>
                                    #include <esp_now.h>
                                    #include <esp_wifi.h>
                                    #include <driver/i2s.h>
                                `}
                            />
                        </Fig>
                        <SectionParagraph>
                            The sketch uses the Arduino framework on ESP32, the low-level ESP-IDF I2S driver, and ESP-NOW for direct
                            device-to-device transport.
                        </SectionParagraph>
                    </section>

                    {/* PINS & RATE */}
                    <section aria-labelledby="pins-rate">
                        <SectionHeader id="pins-rate">Pins & Sample Rate</SectionHeader>
                        <Fig caption="Sample rate and GPIO mapping for I2S, LEDs and PTT.">
                            <CodeSnippet
                                language="c"
                                title="Pins / Rate"
                                code={`
                                    #define SR 16000
                                    #define PIN_BCLK 14
                                    #define PIN_LRCLK 27
                                    #define PIN_DOUT 25
                                    #define PIN_DIN 33
                                    #define PIN_LED_TX 13   // TX indicator (already used)
                                    #define PIN_LED_RX 26   // lights when peer is talking (RX active)
                                    #define PIN_LED_LINK 23 // link/alive indicator
                                    #define PIN_PTT 32
                                `}
                            />
                        </Fig>
                        <SectionParagraph>
                            Adjust pins to your I2S mic/amp wiring. TX LED shows when you transmit. RX LED lights while playing fresh
                            packets. LINK LED reflects PING/PONG responses.
                        </SectionParagraph>
                    </section>

                    {/* ESP-NOW BASICS */}
                    <section aria-labelledby="espnow">
                        <SectionHeader id="espnow">ESP-NOW Basics</SectionHeader>
                        <Fig caption="Fixed channel and destination address (broadcast by default).">
                            <CodeSnippet
                                language="c"
                                title="ESP-NOW"
                                code={`
                                    static const int WIFI_CH = 6;
                                    // Set to peer MAC for unicast, or FF:FF:FF:FF:FF:FF for broadcast
                                    uint8_t DEST[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
                                `}
                            />
                        </Fig>
                        <SectionParagraph>
                            Set both devices to the same channel. Use broadcast to get started, then switch to the peer MAC address for
                            unicast.
                        </SectionParagraph>
                    </section>

                    {/* AUDIO PACKET & JB */}
                    <section aria-labelledby="packet-jb">
                        <SectionHeader id="packet-jb">Audio Packet & Jitter Buffer</SectionHeader>
                        <Fig caption="Frame sizing, preroll, buffer depth, and idle threshold.">
                            <CodeSnippet
                                language="c"
                                title="Audio Packet / JB"
                                code={`
                                    static const int FRAMES = 128;     // ~8.0 ms @16k
                                    static const int PREROLL_PKTS = 3; // ~24 ms pre-roll
                                    static const int JB_SIZE = 64;     // jitter buffer slots
                                    static const int IDLE_MS = 40;     // RX idle threshold
                                `}
                            />
                        </Fig>
                        <SectionList>
                            <li>
                                <strong>FRAMES:</strong> samples per packet (per channel after downmix). Smaller reduces latency but raises
                                overhead.
                            </li>
                            <li>
                                <strong>PREROLL_PKTS:</strong> how many packets to accumulate before PLAY.
                            </li>
                            <li>
                                <strong>JB_SIZE:</strong> circular buffer slots; keep comfortably larger than transient jitter.
                            </li>
                            <li>
                                <strong>IDLE_MS:</strong> if no fresh packets for this long, go back to IDLE.
                            </li>
                        </SectionList>

                        <Fig caption="On-air audio payload and JB slot format.">
                            <CodeSnippet
                                language="c"
                                title="Structures"
                                code={`
                                    struct __attribute__((packed)) AudioPkt {
                                        uint32_t seq;
                                        uint16_t n;
                                        int16_t pcm[FRAMES];
                                    };

                                    struct JBSlot {
                                        uint32_t seq;
                                        uint16_t n;
                                        int16_t pcm[FRAMES];
                                        volatile uint8_t valid;
                                    };
                                    static JBSlot jb[JB_SIZE];
                                `}
                            />
                        </Fig>
                        <SectionParagraph>
                            Each received packet is copied into a slot indexed by <code>seq % JB_SIZE</code>, marked valid, and later
                            consumed in order.
                        </SectionParagraph>

                        <Fig caption="Newest sequence observed and last receive timestamp.">
                            <CodeSnippet
                                language="c"
                                title="RX markers"
                                code={`
                                    static volatile uint32_t newest_seq = 0;
                                    static volatile uint32_t last_rx_ms = 0;
                                `}
                            />
                        </Fig>

                        <Fig caption="Send gating and local sequence counter.">
                            <CodeSnippet
                                language="c"
                                title="TX markers"
                                code={`
                                    static volatile bool canSend = true;
                                    static uint32_t seq = 0;
                                `}
                            />
                        </Fig>

                        <Fig caption="Convert 32-bit I2S samples down to 16-bit with headroom.">
                            <CodeSnippet language="c" title="Narrowing" code={`
                                #define NARROW_SHIFT 11
                            `} />
                        </Fig>
                    </section>

                    {/* I2S DRIVER */}
                    <section aria-labelledby="i2s">
                        <SectionHeader id="i2s">I2S Driver</SectionHeader>
                        <Fig caption="I2S DMA sizing and temporary frame buffers.">
                            <CodeSnippet
                                language="c"
                                title="I2S DMA"
                                code={`
                                    static const int DMA_LEN = 512;
                                    static const int DMA_CNT = 8;
                                    static int32_t outFrame[FRAMES * 2];
                                    static int32_t in32[FRAMES * 2];
                                `}
                            />
                        </Fig>

                        <Fig caption="Master RX|TX, 32-bit samples, stereo, and pin mux.">
                            <CodeSnippet
                                language="c"
                                title="i2sInstall()"
                                code={`
                                    static inline void i2sInstall() {
                                        i2s_driver_uninstall(I2S_NUM_0);
                                        i2s_config_t cfg = {
                                            .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX | I2S_MODE_RX),
                                            .sample_rate = SR,
                                            .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
                                            .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
                                            .communication_format = I2S_COMM_FORMAT_STAND_I2S,
                                            .intr_alloc_flags = 0,
                                            .dma_buf_count = DMA_CNT,
                                            .dma_buf_len = DMA_LEN,
                                            .use_apll = false,
                                            .tx_desc_auto_clear = true,
                                            .fixed_mclk = 0
                                        };
                                        i2s_pin_config_t pins = {
                                            .bck_io_num = PIN_BCLK,
                                            .ws_io_num = PIN_LRCLK,
                                            .data_out_num = PIN_DOUT,
                                            .data_in_num = PIN_DIN
                                        };
                                        i2s_driver_install(I2S_NUM_0, &cfg, 0, nullptr);
                                        i2s_set_pin(I2S_NUM_0, &pins);
                                        i2s_set_clk(I2S_NUM_0, SR, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_STEREO);
                                        i2s_zero_dma_buffer(I2S_NUM_0);
                                    }
                                `}
                            />
                        </Fig>

                        <Fig caption="Feeds DAC when muting or waiting.">
                            <CodeSnippet
                                language="c"
                                title="writeSilenceFrame()"
                                code={`
                                    static inline void writeSilenceFrame() {
                                        static const int32_t z = 0;
                                        for (int i = 0; i < FRAMES; ++i) {
                                            outFrame[2 * i + 0] = z;
                                            outFrame[2 * i + 1] = z;
                                        }
                                        size_t w;
                                        i2s_write(I2S_NUM_0, (const char *)outFrame, FRAMES * 2 * sizeof(int32_t), &w, 0);
                                    }
                                `} />
                        </Fig>
                    </section>

                    {/* KEEPALIVE */}
                    <section aria-labelledby="keepalive">
                        <SectionHeader id="keepalive">Keepalive (PING/PONG)</SectionHeader>
                        <SectionParagraph>
                            A tiny control packet (different size from audio) is used to ping the peer when we are not transmitting.
                            Recent PONGs light the LINK LED.
                        </SectionParagraph>
                        <Fig caption="Control structure and timings for link health.">
                            <CodeSnippet
                                language="c"
                                title="CtrlPkt & timers"
                                code={`
                                    struct __attribute__((packed)) CtrlPkt { uint8_t tag; uint32_t id; };
                                    static uint32_t ping_id = 0;
                                    static uint32_t last_ping_ms = 0;
                                    static uint32_t last_pong_ms = 0;
                                    static const uint32_t PING_EVERY_MS = 500;
                                    static const uint32_t LINK_TIMEOUT_MS = 1500;
                                `}
                            />
                        </Fig>
                    </section>

                    {/* ESP-NOW CALLBACKS */}
                    <section aria-labelledby="callbacks">
                        <SectionHeader id="callbacks">ESP-NOW Callbacks</SectionHeader>
                        <Fig caption="TX gating and demuxing CTRL vs AUDIO.">
                            <CodeSnippet
                                language="c"
                                title="Callbacks"
                                code={`
                                    static void onSent(const wifi_tx_info_t *, esp_now_send_status_t) { canSend = true; }

                                    static void onRecv(const esp_now_recv_info_t *, const uint8_t *data, int len) {
                                        if (len == (int)sizeof(CtrlPkt)) {
                                            CtrlPkt cp; memcpy(&cp, data, sizeof(CtrlPkt));
                                            if (cp.tag == 'P') {
                                                if (canSend) { canSend = false; CtrlPkt rp{'p', cp.id}; esp_now_send(DEST, (uint8_t *)&rp, sizeof(rp)); }
                                            } else if (cp.tag == 'p') { last_pong_ms = millis(); }
                                            return;
                                        }
                                        if (len < (int)(sizeof(uint32_t) + sizeof(uint16_t))) return;
                                        if (len > (int)sizeof(AudioPkt)) len = sizeof(AudioPkt);

                                        AudioPkt pkt; memcpy(&pkt, data, len); if (pkt.n > FRAMES) pkt.n = FRAMES;
                                        JBSlot &slot = jb[pkt.seq % JB_SIZE];
                                        slot.seq = pkt.seq; slot.n = pkt.n; memcpy(slot.pcm, pkt.pcm, pkt.n * sizeof(int16_t)); slot.valid = 1;
                                        newest_seq = pkt.seq; last_rx_ms = millis();
                                    }
                                `} />
                        </Fig>
                    </section>

                    {/* RADIO INIT */}
                    <section aria-labelledby="radio">
                        <SectionHeader id="radio">Radio Init</SectionHeader>
                        <Fig caption="Station mode, no power save, channel pinning, and peer add.">
                            <CodeSnippet
                                language="c"
                                title="radioInit()"
                                code={`
                                    static void radioInit() {
                                    WiFi.persistent(false);
                                    WiFi.mode(WIFI_STA);
                                    WiFi.disconnect(true, true);
                                    esp_wifi_set_ps(WIFI_PS_NONE);
                                    esp_wifi_set_channel(WIFI_CH, WIFI_SECOND_CHAN_NONE);
                                    esp_now_init();
                                    esp_now_register_send_cb(onSent);
                                    esp_now_register_recv_cb(onRecv);
                                    esp_now_peer_info_t p{}; memcpy(p.peer_addr, DEST, 6); p.ifidx = WIFI_IF_STA; p.channel = 0; p.encrypt = false; esp_now_add_peer(&p);
                                }
                            `} />
                        </Fig>
                    </section>

                    {/* TX HELPERS */}
                    <section aria-labelledby="tx">
                        <SectionHeader id="tx">TX Helpers</SectionHeader>
                        <Fig caption="Gated sending to avoid overlapping ESP-NOW TX.">
                            <CodeSnippet
                                language="c"
                                title="wait/send"
                                code={`
                                    static inline void waitForCanSend(uint32_t timeout_ms) {
                                        uint32_t t0 = millis();
                                        while (!canSend && (millis() - t0) < timeout_ms) { delay(1); }
                                    }
                                    static inline void sendPkt(AudioPkt &pkt, uint16_t n) {
                                        waitForCanSend(20);
                                        if (!canSend) return;
                                        canSend = false; pkt.seq = seq++; pkt.n = n;
                                        size_t bytes = sizeof(pkt.seq) + sizeof(pkt.n) + n * sizeof(int16_t);
                                        esp_now_send(DEST, (uint8_t *)&pkt, bytes);
                                    }
                                `} />
                        </Fig>

                        <Fig caption="Silent preroll before TX; ping only when idle.">
                            <CodeSnippet
                                language="c"
                                title="preroll/ping"
                                code={`
                                    static inline void sendPreroll() {
                                        AudioPkt s{}; for (int i = 0; i < PREROLL_PKTS; ++i) { sendPkt(s, FRAMES); }
                                    }
                                    static inline void maybeSendPing(bool txActive) {
                                        uint32_t now = millis(); if (txActive) return; if (now - last_ping_ms < PING_EVERY_MS) return; last_ping_ms = now;
                                        CtrlPkt cp{'P', ++ping_id}; waitForCanSend(10); if (!canSend) return; canSend = false; esp_now_send(DEST, (uint8_t *)&cp, sizeof(cp));
                                    }
                                `} />
                        </Fig>
                    </section>

                    {/* RX STATE MACHINE */}
                    <section aria-labelledby="rx-sm">
                        <SectionHeader id="rx-sm">RX Playback State Machine</SectionHeader>
                        <SectionParagraph>
                            RX cycles IDLE → PREROLL → PLAY. During PLAY we consume expected sequence numbers; missing frames are
                            concealed with silence. If no fresh packets arrive for <code>IDLE_MS</code>, we return to IDLE.
                        </SectionParagraph>
                        <Fig caption="State enum, scheduling clock, and first/expected seq tracking.">
                            <CodeSnippet
                                language="c"
                                title="State vars"
                                code={`
                                    enum class PlayState : uint8_t { IDLE, PREROLL, PLAY };
                                    static PlayState state = PlayState::IDLE;
                                    static uint32_t next_t_us = 0;
                                    static uint32_t first_seq_after_idle = 0;
                                `} />
                        </Fig>

                        <Fig caption="Downmix, clamp, and schedule frames to I2S with jitter tolerance.">
                            <CodeSnippet
                                language="c"
                                title="consumeAndPlay()"
                                code={`
                                    static inline void consumeAndPlay(uint32_t now_us) {
                                        if ((int32_t)(now_us - next_t_us) < 0) return;
                                        next_t_us += (uint32_t)((1000000ULL * FRAMES) / SR);

                                        if (state == PlayState::IDLE) { writeSilenceFrame(); return; }

                                        if (state == PlayState::PREROLL) {
                                            uint32_t have = (uint32_t)(newest_seq - first_seq_after_idle + 1);
                                            writeSilenceFrame();
                                            if (have >= (uint32_t)PREROLL_PKTS) { state = PlayState::PLAY; }
                                            return;
                                        }

                                        static uint32_t exp_seq = 0; if (exp_seq == 0) { exp_seq = first_seq_after_idle + PREROLL_PKTS; }
                                        JBSlot &slot = jb[exp_seq % JB_SIZE]; bool got = (slot.valid && slot.seq == exp_seq);

                                        int16_t mono[FRAMES];
                                        if (got) {
                                            int n = slot.n; if (n < 0) n = 0; if (n > FRAMES) n = FRAMES;
                                            memcpy(mono, slot.pcm, n * sizeof(int16_t)); if (n < FRAMES) memset(mono + n, 0, (FRAMES - n) * sizeof(int16_t));
                                            slot.valid = 0;
                                        } else { memset(mono, 0, sizeof(mono)); }

                                        for (int i = 0; i < FRAMES; ++i) {
                                            int32_t v = (mono[i] * 16384 + 16384) >> 15; if (v > 30000) v = 30000; if (v < -30000) v = -30000;
                                            int32_t s32 = ((int32_t)v) << 16; outFrame[2 * i + 0] = s32; outFrame[2 * i + 1] = s32;
                                        }
                                        size_t w; i2s_write(I2S_NUM_0, (const char *)outFrame, FRAMES * 2 * sizeof(int32_t), &w, 0);

                                        exp_seq++;
                                        if ((millis() - last_rx_ms) > IDLE_MS) { state = PlayState::IDLE; exp_seq = 0; }
                                    }
                                `} />
                        </Fig>
                    </section>

                    {/* SETUP & LOOP */}
                    <section aria-labelledby="setup-loop">
                        <SectionHeader id="setup-loop">Setup & Loop</SectionHeader>
                        <Fig caption="GPIO init, I2S + radio bring-up, initial state.">
                            <CodeSnippet
                                language="c"
                                title="setup()"
                                code={`
                                    void setup() {
                                        pinMode(PIN_LED_TX, OUTPUT);
                                        pinMode(PIN_LED_RX, OUTPUT);
                                        pinMode(PIN_LED_LINK, OUTPUT);
                                        digitalWrite(PIN_LED_TX, LOW);
                                        digitalWrite(PIN_LED_RX, LOW);
                                        digitalWrite(PIN_LED_LINK, LOW);

                                        pinMode(PIN_PTT, INPUT_PULLUP);

                                        i2sInstall();
                                        radioInit();

                                        state = PlayState::IDLE;
                                        next_t_us = micros();
                                        last_pong_ms = 0; // LINK LED stays off until a PONG arrives
                                    }
                                `} />
                        </Fig>

                        <Fig caption="TX on press (with preroll); otherwise RX + keepalive + LEDs.">
                            <CodeSnippet
                                language="c"
                                title="loop()"
                                code={`
                                    void loop() {
                                        const bool pressed = (digitalRead(PIN_PTT) == LOW);
                                        static bool wasPressed = false;

                                        if (pressed && !wasPressed) {
                                            digitalWrite(PIN_LED_TX, HIGH);
                                            state = PlayState::IDLE; // mute local playback while TX
                                            sendPreroll();
                                            wasPressed = true;
                                        }

                                        if (pressed) {
                                            size_t br = 0;
                                            if (i2s_read(I2S_NUM_0, (void *)in32, sizeof(in32), &br, 10 / portTICK_PERIOD_MS) == ESP_OK) {
                                                int framesRead = (int)(br / sizeof(int32_t)) / 2;
                                                if (framesRead > 0) {
                                                    if (framesRead > FRAMES) framesRead = FRAMES;
                                                    AudioPkt pkt{};
                                                    for (int i = 0; i < framesRead; ++i) {
                                                        int32_t s32 = in32[2 * i + 0]; // LEFT
                                                        int32_t v = s32 >> NARROW_SHIFT;
                                                        if (v > 32767) v = 32767; if (v < -32768) v = -32768;
                                                        int16_t s16 = (int16_t)v;
                                                        if (s16 > 30000) s16 = 30000; if (s16 < -30000) s16 = -30000;
                                                        pkt.pcm[i] = s16;
                                                    }
                                                    for (int i = framesRead; i < FRAMES; ++i) pkt.pcm[i] = 0;
                                                    sendPkt(pkt, FRAMES);
                                                }
                                            }
                                            uint32_t now = micros();
                                            for (int i = 0; i < 4; ++i) { if ((int32_t)(now - next_t_us) < 0) break; writeSilenceFrame(); next_t_us += (uint32_t)((1000000ULL * FRAMES) / SR); now = micros(); }
                                            digitalWrite(PIN_LED_RX, LOW);
                                        } else {
                                            digitalWrite(PIN_LED_TX, LOW);
                                            if (state == PlayState::IDLE) {
                                                if ((millis() - last_rx_ms) <= IDLE_MS) { first_seq_after_idle = newest_seq; state = PlayState::PREROLL; next_t_us = micros(); }
                                            }
                                            uint32_t now = micros();
                                            for (int i = 0; i < 4; ++i) { if ((int32_t)(now - next_t_us) < 0) break; consumeAndPlay(now); now = micros(); }
                                            wasPressed = false;
                                            maybeSendPing(false);
                                            bool rxActive = (state == PlayState::PLAY) && ((millis() - last_rx_ms) <= IDLE_MS);
                                            digitalWrite(PIN_LED_RX, rxActive ? HIGH : LOW);
                                        }
                                        bool linkOk = (millis() - last_pong_ms) <= LINK_TIMEOUT_MS;
                                        digitalWrite(PIN_LED_LINK, linkOk ? HIGH : LOW);
                                    }
                                `} />
                        </Fig>

                        <SectionParagraph>
                            When PTT is pressed, we transmit and locally play silence to keep I2S timing stable. When released, RX
                            resumes, and keepalives update the link LED. Tune <code>PREROLL_PKTS</code>, <code>JB_SIZE</code>, and
                            <code>IDLE_MS</code> based on your channel.
                        </SectionParagraph>
                    </section>

                    {/* TUNING NOTES */}
                    <section aria-labelledby="tuning">
                        <SectionHeader id="tuning">Tuning & Notes</SectionHeader>
                        <SectionList>
                            <li>
                                <strong>Latency vs gaps:</strong> Smaller <code>FRAMES</code> and <code>PREROLL_PKTS</code> reduce delay but
                                require steadier airtime.
                            </li>
                            <li>
                                <strong>Levels:</strong> The TX path narrows and soft-clips to ~±30000 to avoid DAC clipping; adjust to taste.
                            </li>
                            <li>
                                <strong>Channel:</strong> Fix both peers to the same <code>WIFI_CH</code>. Avoid congested channels.
                            </li>
                            <li>
                                <strong>Power save:</strong> Disabled to reduce jitter (<code>WIFI_PS_NONE</code>).
                            </li>
                            <li>
                                <strong>Security:</strong> ESP-NOW can encrypt with peer keys; this demo uses unencrypted broadcast.
                            </li>
                        </SectionList>
                    </section>
                </div>
            </main>
        </div>
    );
}
