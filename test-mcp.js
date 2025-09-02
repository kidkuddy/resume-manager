#!/usr/bin/env node

/**
 * Simple test script for the MCP server
 */

const { spawn } = require('child_process');

function testMCPServer() {
  const mcp = spawn('node', ['mcp-server.js'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  let responses = [];
  let buffer = '';

  mcp.stdout.on('data', (data) => {
    buffer += data.toString();
    
    // Process complete lines
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          responses.push(response);
          console.log('📨 Response:', JSON.stringify(response, null, 2));
        } catch (e) {
          console.log('📝 Raw output:', line);
        }
      }
    }
  });

  mcp.on('close', (code) => {
    console.log(`\n✅ MCP server test completed with code ${code}`);
    console.log(`📊 Total responses: ${responses.length}`);
  });

  // Send test messages
  console.log('🚀 Testing MCP server...\n');
  
  console.log('1️⃣ Sending initialize...');
  mcp.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {}
  }) + '\n');

  setTimeout(() => {
    console.log('2️⃣ Sending tools/list...');
    mcp.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }) + '\n');
  }, 500);

  setTimeout(() => {
    console.log('3️⃣ Sending get_resume_data...');
    mcp.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_resume_data',
        arguments: {}
      }
    }) + '\n');
  }, 1000);

  setTimeout(() => {
    console.log('4️⃣ Closing connection...');
    mcp.stdin.end();
  }, 2000);
}

testMCPServer();
