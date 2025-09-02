#!/usr/bin/env node

const http = require('http');
const { URL } = require('url');

// MCP Server that proxies to Next.js API
class MCPProxy {
  constructor(nextJsUrl = 'http://localhost:3000') {
    this.nextJsUrl = nextJsUrl;
  }

  async makeRequest(data) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/mcp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            resolve(result);
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async handleStdio() {
    process.stdin.setEncoding('utf8');
    
    let buffer = '';
    
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      
      // Process complete JSON messages
      let lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const request = JSON.parse(line);
            const response = await this.makeRequest(request);
            process.stdout.write(JSON.stringify(response) + '\n');
          } catch (error) {
            const errorResponse = {
              jsonrpc: '2.0',
              id: null,
              error: {
                code: -32700,
                message: `Parse error: ${error.message}`
              }
            };
            process.stdout.write(JSON.stringify(errorResponse) + '\n');
          }
        }
      }
    });

    process.stdin.on('end', () => {
      process.exit(0);
    });
  }
}

// Initialize and start the proxy
const proxy = new MCPProxy();
proxy.handleStdio();
