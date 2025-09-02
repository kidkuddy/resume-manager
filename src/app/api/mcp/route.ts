import { NextRequest } from 'next/server';
import { Experience } from '@/types';

// Model Context Protocol Types
interface MCPRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id?: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

// MCP Tools Definition
const MCP_TOOLS: MCPTool[] = [
  {
    name: 'get_resume_data',
    description: 'Get complete resume data including profile, experiences, projects, skills, certifications, activities, and education',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_latex_templates',
    description: 'Get all available LaTeX resume templates',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_latex_template_by_id',
    description: 'Get a specific LaTeX template by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The ID of the template to retrieve'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_experiences_by_tag',
    description: 'Search work experiences by tag',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'The tag to search for in experiences'
        }
      },
      required: ['tag']
    }
  }
];

// MCP Tool Handlers
async function handleGetResumeData() {
  try {
    const [profileResponse, dataResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/profile`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data`)
    ]);

    const profile = profileResponse.ok ? await profileResponse.json() : null;
    const data = dataResponse.ok ? await dataResponse.json() : {
      experiences: [],
      projects: [],
      skills: [],
      certifications: [],
      activities: [],
      education: []
    };

    return {
      profile,
      experiences: data.experiences || [],
      projects: data.projects || [],
      skills: data.skills || [],
      certifications: data.certifications || [],
      activities: data.activities || [],
      education: data.education || []
    };
  } catch (error) {
    throw new Error(`Failed to get resume data: ${error}`);
  }
}

async function handleGetLatexTemplates() {
  try {
    const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data`);
    const data = dataResponse.ok ? await dataResponse.json() : { templates: [] };
    return data.templates || [];
  } catch (error) {
    throw new Error(`Failed to get LaTeX templates: ${error}`);
  }
}

async function handleGetLatexTemplateById(id: string) {
  try {
    const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data`);
    const data = dataResponse.ok ? await dataResponse.json() : { templates: [] };
    
    const template = (data.templates || []).find((t: any) => t.id === id);
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }
    return template;
  } catch (error) {
    throw new Error(`Failed to get template by ID: ${error}`);
  }
}

async function handleSearchExperiencesByTag(tag: string) {
  try {
    const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data`);
    const data = dataResponse.ok ? await dataResponse.json() : { experiences: [] };
    
    const filteredExperiences = (data.experiences || []).filter((exp: any) => 
      exp.tags && exp.tags.some((t: string) => 
        t.toLowerCase().includes(tag.toLowerCase())
      )
    );
    return filteredExperiences;
  } catch (error) {
    throw new Error(`Failed to search experiences by tag: ${error}`);
  }
}

// Main MCP Handler
async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  try {
    switch (request.method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'resume-manager-mcp',
              version: '1.0.0'
            }
          }
        };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: MCP_TOOLS
          }
        };

      case 'tools/call':
        const { name, arguments: args } = request.params;
        let result;

        switch (name) {
          case 'get_resume_data':
            result = await handleGetResumeData();
            break;

          case 'get_latex_templates':
            result = await handleGetLatexTemplates();
            break;

          case 'get_latex_template_by_id':
            if (!args?.id) {
              throw new Error('Template ID is required');
            }
            result = await handleGetLatexTemplateById(args.id);
            break;

          case 'search_experiences_by_tag':
            if (!args?.tag) {
              throw new Error('Tag is required');
            }
            result = await handleSearchExperiencesByTag(args.tag);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        };

      default:
        throw new Error(`Unknown method: ${request.method}`);
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error'
      }
    };
  }
}

// HTTP POST handler for MCP requests
export async function POST(request: NextRequest) {
  try {
    const mcpRequest: MCPRequest = await request.json();
    const response = await handleMCPRequest(mcpRequest);
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error'
      }
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
