# MCP Playground 🚀

A **Model Context Protocol (MCP) playground** for experimenting with various MCP integrations and demonstrating enhanced workflows across different domains. This repository serves as a hands-on laboratory for exploring how MCP servers can revolutionize various professional workflows beyond traditional development.

## 🎯 Repository Purpose

This playground is designed to:
- **Explore MCP integrations** with different services (GitHub, Atlassian, Notion, Slack, etc.)
- **Demonstrate enhanced workflows** across various professional domains
- **Test workflow automation** using MCP servers as bridges between tools
- **Create replicable patterns** that can be adapted to different use cases
- **Document learnings** and share proven workflow patterns with the community

*Note: While these workflows are demonstrated using **Cursor IDE**, they are not limited to Cursor and can be replicated with any AI coding assistant that supports MCP integrations.*

## 🔧 Current MCP Integrations

### 1. GitHub MCP Server
- **Purpose**: Access GitHub issues, pull requests, and repository data
- **Use Cases**: Requirement gathering, issue analysis, code review assistance
- **Configuration**: HTTP-based connection with PAT authentication

### 2. Atlassian MCP Server  
- **Purpose**: Read Confluence documentation and Jira issues
- **Use Cases**: Manual test case extraction, documentation analysis, requirement clarification
- **Configuration**: Remote MCP server via npx

## 🔄 Tested Workflows

### 1. 🧪 **Automating Unit Test First Development using MCP**

**Workflow Description**: Seamlessly integrate external requirements gathering with automated unit test creation by chaining multiple MCP servers. This workflow demonstrates how to eliminate context switching between issue tracking systems and documentation tools while maintaining perfect traceability from external specifications to implemented code.

**Use Case**: Software development teams that need to translate manual test cases from documentation systems (like Confluence) into automated unit tests while ensuring 100% alignment with requirements from issue tracking systems (like GitHub).

**MCP Servers Used**: GitHub MCP + Atlassian MCP  
**Workflow**: GitHub Issue → Confluence Test Cases → Automated Unit Tests → Implementation  
**Key Benefits**: Zero context loss, perfect specification alignment, end-to-end traceability

#### 🎭 **Demo Project**: [Rick and Morty Character List](./docs/rick-and-morty-character-list-poc.md)
- **📋 Specifications**: GitHub issue + 25 Confluence manual test cases
- **✅ Results**: 82%+ test coverage, 19 automated unit tests, production-ready code
- **🎯 Outcome**: Flawless implementation in single iteration with zero issues

[**📖 Read the complete workflow documentation →**](./docs/rick-and-morty-character-list-poc.md)

---

*More workflows coming soon! This section will expand as we test additional MCP-powered workflow patterns across different domains.*

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cursor IDE (recommended) or VS Code
- GitHub Personal Access Token
- Atlassian account (for Confluence integration)

### Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MCP servers**
   - Copy `.cursor/mcp.json.example` to `.cursor/mcp.json`
   - Add your GitHub PAT and Atlassian credentials
   - Follow individual project setup guides

4. **Run the current project**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   npm run test:coverage
   ```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Testing**: Jest, React Testing Library, MSW
- **Development**: Cursor IDE, MCP servers
- **APIs**: Rick and Morty API (for demo projects)

## 📋 Project Structure

```
mcp-playground/
├── .cursor/
│   └── mcp.json              # MCP server configurations
├── docs/                     # Project documentation
│   └── rick-and-morty-character-list-poc.md
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── ...
├── jest.config.js           # Test configuration
├── package.json
└── README.md
```

## 🎓 Learning Resources

### MCP Integration Guides
- [Setting up GitHub MCP](https://github.com/github/github-mcp-server?tab=readme-ov-file)
- [Configuring Atlassian MCP](https://community.atlassian.com/forums/Atlassian-Platform-articles/Atlassian-Remote-MCP-Server-beta-now-available-for-desktop/ba-p/3022084)
- [Learn more about MCP](https://modelcontextprotocol.io/introduction)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** for Claude Sonnet 4 and MCP protocol
- **Cursor Team** for excellent AI-integrated development experience
- **Rick and Morty API** for providing free, fun API for demos
