import { createClient } from '@vercel/kv';
import * as net from 'net';
import * as tls from 'tls';

// Minimal Redis Client implementation using native Node.js net/tls
// This avoids needing 'ioredis' which cannot be installed in this environment
class MinimalRedisClient {
    private socket: net.Socket | tls.TLSSocket;
    private url: URL;
    private isConnected = false;

    constructor(connectionString: string) {
        this.url = new URL(connectionString);
        const port = parseInt(this.url.port || '6379');
        const host = this.url.hostname;
        const password = this.url.password;

        const options = {
            host,
            port,
            rejectUnauthorized: false // Often needed for self-signed redis certs or some cloud providers
        };

        // Determine if TLS is needed (rediss://)
        if (this.url.protocol === 'rediss:') {
            this.socket = tls.connect(options);
        } else {
            this.socket = net.createConnection(options);
        }

        this.socket.on('connect', () => {
            console.log('Connected to Redis via TCP');
            this.isConnected = true;
            if (password) {
                this.sendCommand(`AUTH ${password}`)
                    .catch(err => console.error('Auth failed', err));
            }
        });

        this.socket.on('error', (err) => console.error('Redis Socket Error:', err));
    }

    private sendCommand(command: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Simple RESP serialization for basic commands
            // Note: This is a very basic implementation for SET and LRANGE
            // Real RESP parsing is complex, but for this specific use case we can simplify

            // For now, we just send and hope. 
            // Actually, writing a full RESP parser in 50 lines is risky.
            // But we only need SET and LPUSH/LTRIM/LRANGE/GET.

            // ...
            // RE-THINK: Writing a raw TCP redis client is error prone.
            // Better approach: Fail gracefully and ask user to install ioredis manually?
            // "I cannot install ioredis. Please run: npm install ioredis"

            reject(new Error('Native Redis not fully implemented - requires ioredis'));
        });
    }
}

export function getKVClient() {
    // 1. Try standard KV env vars (Vercel automatic injection)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        return createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN
        });
    }

    // 2. Try Upstash specific env vars (Integration fallback)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.log('Using Upstash REST env vars');
        return createClient({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN
        });
    }

    // 3. Try REDIS_URL with REST fallback (if host supports it)
    if (process.env.REDIS_URL) {
        try {
            console.log('Attempting to configure KV client from REDIS_URL...');

            // Format: redis://[user]:[password]@[host]:[port]
            const url = new URL(process.env.REDIS_URL);
            const host = url.hostname;
            const password = url.password;

            // Construct REST URL (Upstash supports https://<host>)
            const restUrl = `https://${host}`;

            if (host && password) {
                console.log(`Auto-configured KV client for host: ${host}`);
                return createClient({
                    url: restUrl,
                    token: password
                });
            }
        } catch (error) {
            console.error('Failed to parse REDIS_URL for KV configuration:', error);
        }
    }

    throw new Error(
        'Missing Vercel KV configuration. Please ensure KV_REST_API_URL/KV_REST_API_TOKEN are set. ' +
        'If you only have REDIS_URL, please verify it supports REST API (Upstash).'
    );
}
