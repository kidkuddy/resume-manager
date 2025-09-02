# Resume Manager MCP Server ✅

This MCP (Model Context Protocol) server allows AI assistants like Claude Desktop to query your resume data and generate tailored resumes based on job postings.

## ✅ Status: FULLY WORKING

The MCP server has been tested and is working correctly:
- ✅ Initialize protocol handshake
- ✅ Tools list discovery  
- ✅ Resume data retrieval
- ✅ LaTeX templates access
- ✅ Experience search functionality

## 🎯 Features

The MCP server exposes the following tools:

### `get_resume_data`
- **Description**: Get complete resume data including profile, experiences, projects, skills, certifications, activities, and education
- **Parameters**: None
- **Returns**: Complete resume dataset in JSON format

### `get_latex_templates`
- **Description**: Get all available LaTeX resume templates
- **Parameters**: None
- **Returns**: Array of all LaTeX templates with metadata

### `get_latex_template_by_id`
- **Description**: Get a specific LaTeX template by its ID
- **Parameters**: 
  - `id` (string, required): The ID of the template to retrieve
- **Returns**: LaTeX template object with content

### `search_experiences_by_tag`
- **Description**: Search work experiences by tag
- **Parameters**:
  - `tag` (string, required): The tag to search for in experiences
- **Returns**: Array of matching experiences

## 🚀 Setup Instructions

### 1. Start Your Resume Manager Application
```bash
cd /Users/niemand/Desktop/github/resume
npm run dev
```
Make sure your Next.js application is running on `http://localhost:3000`

### 2. Configure Claude Desktop

Add the following configuration to your Claude Desktop MCP settings file:

**Location**: 
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration**:
```json
{
  "mcpServers": {
    "resume-manager": {
      "command": "node",
      "args": ["/Users/niemand/Desktop/github/resume/mcp-server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

After adding the configuration, restart Claude Desktop to load the MCP server.

## 💡 Usage Examples

Once configured, you can use Claude Desktop to interact with your resume data:

### Example Prompts:

**Get all resume data:**
> "Use the resume-manager tools to get my complete resume data"

**Search for specific experiences:**
> "Search my experiences for anything tagged with 'javascript' or 'react'"

**Get a specific template:**
> "Get me the LaTeX template with ID 'modern-cv' so I can see its structure"

**Generate a tailored resume:**
> "I'm applying for a [job title] position at [company]. Here's the job posting: [paste job posting]. Please use my resume data and an appropriate LaTeX template to generate a tailored resume that highlights my most relevant experiences and skills for this role."

## 🔧 Technical Details

### Architecture
- **Transport**: stdio (standard input/output)
- **Protocol**: MCP 2024-11-05
- **Backend**: Next.js API routes
- **Data Source**: Your existing resume manager database

### API Endpoint
The MCP server proxies requests to: `http://localhost:3000/api/mcp`

### Error Handling
- Invalid requests return JSON-RPC error responses
- Missing data returns appropriate error messages
- Network issues are handled gracefully

## 🎯 Primary Use Case

**AI-Assisted Resume Generation**: Use Claude Desktop to analyze job postings and automatically generate tailored resumes by:

1. **Analyzing the job posting** for required skills and experience
2. **Querying your resume data** to find relevant experiences and projects
3. **Selecting appropriate experiences** that match the job requirements
4. **Choosing a suitable LaTeX template** for the industry/role
5. **Generating the final resume** with your data populated into the template

This creates a powerful workflow where AI helps you create targeted resumes for each job application! 🚀

## 🛠️ Troubleshooting

### MCP Server Not Found
- Ensure the `mcp-server.js` file path in the config is correct
- Check that Node.js is in your PATH

### Connection Issues
- Verify your Next.js app is running on port 3000
- Check that there are no firewall restrictions

### Tool Errors
- Ensure you have resume data in your application
- Check the Next.js console for API errors
