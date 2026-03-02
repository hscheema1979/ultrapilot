/**
 * Ultrapilot Comprehensive Agent Catalog
 *
 * Contains all unique agents from the agents-lib library,
 * organized by domain and mapped to UltraPilot naming convention.
 *
 * Auto-generated from agents-lib plugin definitions.
 * Generated: 2026-03-02T21:46:44.537Z
 */

export interface AgentType {
  name: string;
  description: string;
  model: 'opus' | 'sonnet' | 'haiku';
  capabilities: string[];
  domain: string;
  plugin: string;
}

export const AGENT_CATALOG: Record<string, AgentType> = {
  'ultra:ui-visual-validator': {
    name: 'ui-visual-validator',
    description: 'Rigorous visual validation expert specializing in UI testing, design system compliance, and accessibility verification. Masters screenshot analysis, visual regression testing, and component validation. Use PROACTIVELY to verify UI modifications have achieved their intended goals through comprehensive visual analysis.',
    model: 'sonnet',
    capabilities: ['accessibility_compliance'],
    domain: 'design',
    plugin: 'accessibility-compliance'
  },

  'ultra:context-manager': {
    name: 'context-manager',
    description: 'Elite AI context engineering specialist mastering dynamic context management, vector databases, knowledge graphs, and intelligent memory systems. Orchestrates context across multi-agent workflows, enterprise AI systems, and long-running projects with 2024/2025 best practices. Use PROACTIVELY for complex AI orchestration.',
    model: 'sonnet',
    capabilities: ['agent_orchestration'],
    domain: 'ai-ml',
    plugin: 'agent-orchestration'
  },

  'ultra:team-debugger': {
    name: 'team-debugger',
    description: 'Hypothesis-driven debugging investigator that investigates one assigned hypothesis, gathering evidence to confirm or falsify it with file:line citations and confidence levels. Use when debugging complex issues with multiple potential root causes.',
    model: 'opus',
    capabilities: ['agent_teams'],
    domain: 'agent-teams',
    plugin: 'agent-teams'
  },

  'ultra:team-implementer': {
    name: 'team-implementer',
    description: 'Parallel feature builder that implements components within strict file ownership boundaries, coordinating at integration points via messaging. Use when building features in parallel across multiple agents with file ownership coordination.',
    model: 'opus',
    capabilities: ['agent_teams'],
    domain: 'agent-teams',
    plugin: 'agent-teams'
  },

  'ultra:team-lead': {
    name: 'team-lead',
    description: 'Team orchestrator that decomposes work into parallel tasks with file ownership boundaries, manages team lifecycle, and synthesizes results. Use when coordinating multi-agent teams, decomposing complex tasks, or managing parallel workstreams.',
    model: 'opus',
    capabilities: ['agent_teams'],
    domain: 'agent-teams',
    plugin: 'agent-teams'
  },

  'ultra:team-reviewer': {
    name: 'team-reviewer',
    description: 'Multi-dimensional code reviewer that operates on one assigned review dimension (security, performance, architecture, testing, or accessibility) with structured finding format. Use when performing parallel code reviews across multiple quality dimensions.',
    model: 'opus',
    capabilities: ['agent_teams'],
    domain: 'agent-teams',
    plugin: 'agent-teams'
  },

  'ultra:backend-architect': {
    name: 'backend-architect',
    description: 'Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems. Masters REST/GraphQL/gRPC APIs, event-driven architectures, service mesh patterns, and modern backend frameworks. Handles service boundary definition, inter-service communication, resilience patterns, and observability. Use PROACTIVELY when creating new backend services or APIs.',
    model: 'sonnet',
    capabilities: ['api_scaffolding'],
    domain: 'software-dev',
    plugin: 'api-scaffolding'
  },

  'ultra:django-pro': {
    name: 'django-pro',
    description: 'Master Django 5.x with async views, DRF, Celery, and Django Channels. Build scalable web applications with proper architecture, testing, and deployment. Use PROACTIVELY for Django development, ORM optimization, or complex Django patterns.',
    model: 'opus',
    capabilities: ['api_scaffolding'],
    domain: 'software-dev',
    plugin: 'api-scaffolding'
  },

  'ultra:fastapi-pro': {
    name: 'fastapi-pro',
    description: 'Build high-performance async APIs with FastAPI, SQLAlchemy 2.0, and Pydantic V2. Master microservices, WebSockets, and modern Python async patterns. Use PROACTIVELY for FastAPI development, async optimization, or API architecture.',
    model: 'opus',
    capabilities: ['api_scaffolding'],
    domain: 'software-dev',
    plugin: 'api-scaffolding'
  },

  'ultra:graphql-architect': {
    name: 'graphql-architect',
    description: 'Master modern GraphQL with federation, performance optimization, and enterprise security. Build scalable schemas, implement advanced caching, and design real-time systems. Use PROACTIVELY for GraphQL architecture or performance optimization.',
    model: 'opus',
    capabilities: ['api_scaffolding'],
    domain: 'software-dev',
    plugin: 'api-scaffolding'
  },

  'ultra:api-documenter': {
    name: 'api-documenter',
    description: 'Master API documentation with OpenAPI 3.1, AI-powered tools, and modern developer experience practices. Create interactive docs, generate SDKs, and build comprehensive developer portals. Use PROACTIVELY for API documentation or developer portal creation.',
    model: 'sonnet',
    capabilities: ['documentation_generation'],
    domain: 'quality',
    plugin: 'documentation-generation'
  },

  'ultra:frontend-developer': {
    name: 'frontend-developer',
    description: 'Build React components, implement responsive layouts, and handle client-side state management. Masters React 19, Next.js 15, and modern frontend architecture. Optimizes performance and ensures accessibility. Use PROACTIVELY when creating UI components or fixing frontend issues.',
    model: 'sonnet',
    capabilities: ['frontend_mobile_security'],
    domain: 'security',
    plugin: 'frontend-mobile-security'
  },

  'ultra:observability-engineer': {
    name: 'observability-engineer',
    description: 'Build production-ready monitoring, logging, and tracing systems. Implements comprehensive observability strategies, SLI/SLO management, and incident response workflows. Use PROACTIVELY for monitoring infrastructure, performance optimization, or production reliability.',
    model: 'sonnet',
    capabilities: ['application_performance'],
    domain: 'operations',
    plugin: 'application-performance'
  },

  'ultra:performance-engineer': {
    name: 'performance-engineer',
    description: 'Profile and optimize application performance including response times, memory usage, query efficiency, and scalability. Use for performance review during feature development.',
    model: 'sonnet',
    capabilities: ['Code Profiling', 'Database Performance', 'API Performance', 'Caching Strategy', 'Memory Management', 'Concurrency', 'Frontend Performance', 'Load Testing Design', 'Scalability Analysis'],
    domain: 'software-dev',
    plugin: 'backend-development'
  },

  'ultra:arm-cortex-expert': {
    name: 'arm-cortex-expert',
    description: '>',
    model: 'sonnet',
    capabilities: ['arm_cortex_microcontrollers'],
    domain: 'arm-cortex-microcontrollers',
    plugin: 'arm-cortex-microcontrollers'
  },

  'ultra:backend-security-coder': {
    name: 'backend-security-coder',
    description: 'Expert in secure backend coding practices specializing in input validation, authentication, and API security. Use PROACTIVELY for backend security implementations or security code reviews.',
    model: 'sonnet',
    capabilities: ['backend_api_security'],
    domain: 'security',
    plugin: 'backend-api-security'
  },

  'ultra:event-sourcing-architect': {
    name: 'event-sourcing-architect',
    description: 'Expert in event sourcing, CQRS, and event-driven architecture patterns. Masters event store design, projection building, saga orchestration, and eventual consistency patterns. Use PROACTIVELY for event-sourced systems, audit trail requirements, or complex domain modeling with temporal queries.',
    model: 'sonnet',
    capabilities: ['backend_development'],
    domain: 'software-dev',
    plugin: 'backend-development'
  },

  'ultra:security-auditor': {
    name: 'security-auditor',
    description: 'Review code and architecture for security vulnerabilities, OWASP Top 10, auth flaws, and compliance issues. Use for security review during feature development.',
    model: 'sonnet',
    capabilities: ['OWASP Top 10 Review', 'Authentication & Authorization', 'Input Validation', 'Data Protection', 'API Security', 'Dependency Scanning', 'Infrastructure Security'],
    domain: 'software-dev',
    plugin: 'backend-development'
  },

  'ultra:tdd-orchestrator': {
    name: 'tdd-orchestrator',
    description: 'Master TDD orchestrator specializing in red-green-refactor discipline, multi-agent workflow coordination, and comprehensive test-driven development practices. Enforces TDD best practices across teams with AI-assisted testing and modern frameworks. Use PROACTIVELY for TDD implementation and governance.',
    model: 'opus',
    capabilities: ['backend_development'],
    domain: 'software-dev',
    plugin: 'backend-development'
  },

  'ultra:temporal-python-pro': {
    name: 'temporal-python-pro',
    description: 'Master Temporal workflow orchestration with Python SDK. Implements durable workflows, saga patterns, and distributed transactions. Covers async/await, testing strategies, and production deployment. Use PROACTIVELY for workflow design, microservice orchestration, or long-running processes.',
    model: 'sonnet',
    capabilities: ['backend_development'],
    domain: 'software-dev',
    plugin: 'backend-development'
  },

  'ultra:test-automator': {
    name: 'test-automator',
    description: 'Create comprehensive test suites including unit, integration, and E2E tests. Supports TDD/BDD workflows. Use for test creation during feature development.',
    model: 'sonnet',
    capabilities: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'TDD Support', 'BDD Support', 'Test Data', 'Mocking & Stubbing', 'Coverage Analysis'],
    domain: 'software-dev',
    plugin: 'backend-development'
  },

  'ultra:blockchain-developer': {
    name: 'blockchain-developer',
    description: 'Build production-ready Web3 applications, smart contracts, and decentralized systems. Implements DeFi protocols, NFT platforms, DAOs, and enterprise blockchain integrations. Use PROACTIVELY for smart contracts, Web3 apps, DeFi protocols, or blockchain infrastructure.',
    model: 'opus',
    capabilities: ['blockchain_web3'],
    domain: 'blockchain-web3',
    plugin: 'blockchain-web3'
  },

  'ultra:business-analyst': {
    name: 'business-analyst',
    description: 'Master modern business analysis with AI-powered analytics, real-time dashboards, and data-driven insights. Build comprehensive KPI frameworks, predictive models, and strategic recommendations. Use PROACTIVELY for business intelligence or strategic analysis.',
    model: 'sonnet',
    capabilities: ['business_analytics'],
    domain: 'data',
    plugin: 'business-analytics'
  },

  'ultra:c4-code': {
    name: 'c4-code',
    description: 'Expert C4 Code-level documentation specialist. Analyzes code directories to create comprehensive C4 code-level documentation including function signatures, arguments, dependencies, and code structure. Use when documenting code at the lowest C4 level for individual directories and code modules.',
    model: 'haiku',
    capabilities: ['c4_architecture'],
    domain: 'architecture',
    plugin: 'c4-architecture'
  },

  'ultra:c4-component': {
    name: 'c4-component',
    description: 'Expert C4 Component-level documentation specialist. Synthesizes C4 Code-level documentation into Component-level architecture, defining component boundaries, interfaces, and relationships. Creates component diagrams and documentation. Use when synthesizing code-level documentation into logical components.',
    model: 'sonnet',
    capabilities: ['c4_architecture'],
    domain: 'architecture',
    plugin: 'c4-architecture'
  },

  'ultra:c4-container': {
    name: 'c4-container',
    description: 'Expert C4 Container-level documentation specialist. Synthesizes Component-level documentation into Container-level architecture, mapping components to deployment units, documenting container interfaces as APIs, and creating container diagrams. Use when synthesizing components into deployment containers and documenting system deployment architecture.',
    model: 'sonnet',
    capabilities: ['c4_architecture'],
    domain: 'architecture',
    plugin: 'c4-architecture'
  },

  'ultra:c4-context': {
    name: 'c4-context',
    description: 'Expert C4 Context-level documentation specialist. Creates high-level system context diagrams, documents personas, user journeys, system features, and external dependencies. Synthesizes container and component documentation with system documentation to create comprehensive context-level architecture. Use when creating the highest-level C4 system context documentation.',
    model: 'sonnet',
    capabilities: ['c4_architecture'],
    domain: 'architecture',
    plugin: 'c4-architecture'
  },

  'ultra:cloud-architect': {
    name: 'cloud-architect',
    description: 'Expert cloud architect specializing in AWS/Azure/GCP multi-cloud infrastructure design, advanced IaC (Terraform/OpenTofu/CDK), FinOps cost optimization, and modern architectural patterns. Masters serverless, microservices, security, compliance, and disaster recovery. Use PROACTIVELY for cloud architecture, cost optimization, migration planning, or multi-cloud strategies.',
    model: 'opus',
    capabilities: ['cicd_automation'],
    domain: 'software-dev',
    plugin: 'cicd-automation'
  },

  'ultra:devops-troubleshooter': {
    name: 'devops-troubleshooter',
    description: 'Expert DevOps troubleshooter specializing in rapid incident response, advanced debugging, and modern observability. Masters log analysis, distributed tracing, Kubernetes debugging, performance optimization, and root cause analysis. Handles production outages, system reliability, and preventive monitoring. Use PROACTIVELY for debugging, incident response, or system troubleshooting.',
    model: 'sonnet',
    capabilities: ['cicd_automation'],
    domain: 'software-dev',
    plugin: 'cicd-automation'
  },

  'ultra:kubernetes-architect': {
    name: 'kubernetes-architect',
    description: 'Expert Kubernetes architect specializing in cloud-native infrastructure, advanced GitOps workflows (ArgoCD/Flux), and enterprise container orchestration. Masters EKS/AKS/GKE, service mesh (Istio/Linkerd), progressive delivery, multi-tenancy, and platform engineering. Handles security, observability, cost optimization, and developer experience. Use PROACTIVELY for K8s architecture, GitOps implementation, or cloud-native platform design.',
    model: 'opus',
    capabilities: ['cicd_automation'],
    domain: 'software-dev',
    plugin: 'cicd-automation'
  },

  'ultra:terraform-specialist': {
    name: 'terraform-specialist',
    description: 'Expert Terraform/OpenTofu specialist mastering advanced IaC automation, state management, and enterprise infrastructure patterns. Handles complex module design, multi-cloud deployments, GitOps workflows, policy as code, and CI/CD integration. Covers migration strategies, security best practices, and modern IaC ecosystems. Use PROACTIVELY for advanced IaC, state management, or infrastructure automation.',
    model: 'opus',
    capabilities: ['cicd_automation'],
    domain: 'software-dev',
    plugin: 'cicd-automation'
  },

  'ultra:deployment-engineer': {
    name: 'deployment-engineer',
    description: 'Expert deployment engineer specializing in modern CI/CD pipelines, GitOps workflows, and advanced deployment automation. Masters GitHub Actions, ArgoCD/Flux, progressive delivery, container security, and platform engineering. Handles zero-downtime deployments, security scanning, and developer experience optimization. Use PROACTIVELY for CI/CD design, GitOps implementation, or deployment automation.',
    model: 'haiku',
    capabilities: ['cloud_infrastructure'],
    domain: 'architecture',
    plugin: 'cloud-infrastructure'
  },

  'ultra:hybrid-cloud-architect': {
    name: 'hybrid-cloud-architect',
    description: 'Expert hybrid cloud architect specializing in complex multi-cloud solutions across AWS/Azure/GCP and private clouds (OpenStack/VMware). Masters hybrid connectivity, workload placement optimization, edge computing, and cross-cloud automation. Handles compliance, cost optimization, disaster recovery, and migration strategies. Use PROACTIVELY for hybrid architecture, multi-cloud strategy, or complex infrastructure integration.',
    model: 'opus',
    capabilities: ['cloud_infrastructure'],
    domain: 'architecture',
    plugin: 'cloud-infrastructure'
  },

  'ultra:network-engineer': {
    name: 'network-engineer',
    description: 'Expert network engineer specializing in modern cloud networking, security architectures, and performance optimization. Masters multi-cloud connectivity, service mesh, zero-trust networking, SSL/TLS, global load balancing, and advanced troubleshooting. Handles CDN optimization, network automation, and compliance. Use PROACTIVELY for network design, connectivity issues, or performance optimization.',
    model: 'sonnet',
    capabilities: ['cloud_infrastructure'],
    domain: 'architecture',
    plugin: 'cloud-infrastructure'
  },

  'ultra:code-reviewer': {
    name: 'code-reviewer',
    description: 'Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability. Masters static analysis tools, security scanning, and configuration review with 2024/2025 best practices. Use PROACTIVELY for code quality assurance.',
    model: 'opus',
    capabilities: ['code_refactoring'],
    domain: 'software-dev',
    plugin: 'code-refactoring'
  },

  'ultra:docs-architect': {
    name: 'docs-architect',
    description: 'Creates comprehensive technical documentation from existing codebases. Analyzes architecture, design patterns, and implementation details to produce long-form technical manuals and ebooks. Use PROACTIVELY for system documentation, architecture guides, or technical deep-dives.',
    model: 'sonnet',
    capabilities: ['code_documentation'],
    domain: 'quality',
    plugin: 'code-documentation'
  },

  'ultra:tutorial-engineer': {
    name: 'tutorial-engineer',
    description: 'Creates step-by-step tutorials and educational content from code. Transforms complex concepts into progressive learning experiences with hands-on examples. Use PROACTIVELY for onboarding guides, feature tutorials, or concept explanations.',
    model: 'sonnet',
    capabilities: ['code_documentation'],
    domain: 'quality',
    plugin: 'code-documentation'
  },

  'ultra:legacy-modernizer': {
    name: 'legacy-modernizer',
    description: 'Refactor legacy codebases, migrate outdated frameworks, and implement gradual modernization. Handles technical debt, dependency updates, and backward compatibility. Use PROACTIVELY for legacy system updates, framework migrations, or technical debt reduction.',
    model: 'sonnet',
    capabilities: ['code_refactoring'],
    domain: 'software-dev',
    plugin: 'code-refactoring'
  },

  'ultra:architect-review': {
    name: 'architect-review',
    description: 'Master software architect specializing in modern architecture patterns, clean architecture, microservices, event-driven systems, and DDD. Reviews system designs and code changes for architectural integrity, scalability, and maintainability. Use PROACTIVELY for architectural decisions.',
    model: 'opus',
    capabilities: ['comprehensive_review'],
    domain: 'quality',
    plugin: 'comprehensive-review'
  },

  'ultra:conductor-validator': {
    name: 'conductor-validator',
    description: 'Validates Conductor project artifacts for completeness, consistency, and correctness. Use after setup, when diagnosing issues, or before implementation to verify project context.',
    model: 'opus',
    capabilities: ['conductor'],
    domain: 'conductor',
    plugin: 'conductor'
  },

  'ultra:content-marketer': {
    name: 'content-marketer',
    description: 'Elite content marketing strategist specializing in AI-powered content creation, omnichannel distribution, SEO optimization, and data-driven performance marketing. Masters modern content tools, social media automation, and conversion optimization with 2024/2025 best practices. Use PROACTIVELY for comprehensive content marketing.',
    model: 'haiku',
    capabilities: ['content_marketing'],
    domain: 'marketing',
    plugin: 'content-marketing'
  },

  'ultra:search-specialist': {
    name: 'search-specialist',
    description: 'Expert web researcher using advanced search techniques and synthesis. Masters search operators, result filtering, and multi-source verification. Handles competitive analysis and fact-checking. Use PROACTIVELY for deep research, information gathering, or trend analysis.',
    model: 'haiku',
    capabilities: ['content_marketing'],
    domain: 'marketing',
    plugin: 'content-marketing'
  },

  'ultra:customer-support': {
    name: 'customer-support',
    description: 'Elite AI-powered customer support specialist mastering conversational AI, automated ticketing, sentiment analysis, and omnichannel support experiences. Integrates modern support tools, chatbot platforms, and CX optimization with 2024/2025 best practices. Use PROACTIVELY for comprehensive customer experience management.',
    model: 'haiku',
    capabilities: ['customer_sales_automation'],
    domain: 'customer-sales-automation',
    plugin: 'customer-sales-automation'
  },

  'ultra:sales-automator': {
    name: 'sales-automator',
    description: 'Draft cold emails, follow-ups, and proposal templates. Creates pricing pages, case studies, and sales scripts. Use PROACTIVELY for sales outreach or lead nurturing.',
    model: 'haiku',
    capabilities: ['customer_sales_automation'],
    domain: 'customer-sales-automation',
    plugin: 'customer-sales-automation'
  },

  'ultra:data-engineer': {
    name: 'data-engineer',
    description: 'Build scalable data pipelines, modern data warehouses, and real-time streaming architectures. Implements Apache Spark, dbt, Airflow, and cloud-native data platforms. Use PROACTIVELY for data pipeline design, analytics infrastructure, or modern data stack implementation.',
    model: 'opus',
    capabilities: ['data_engineering'],
    domain: 'data',
    plugin: 'data-engineering'
  },

  'ultra:database-architect': {
    name: 'database-architect',
    description: 'Expert database architect specializing in data layer design from scratch, technology selection, schema modeling, and scalable database architectures. Masters SQL/NoSQL/TimeSeries database selection, normalization strategies, migration planning, and performance-first design. Handles both greenfield architectures and re-architecture of existing systems. Use PROACTIVELY for database architecture, technology selection, or data modeling decisions.',
    model: 'sonnet',
    capabilities: ['database_cloud_optimization'],
    domain: 'architecture',
    plugin: 'database-cloud-optimization'
  },

  'ultra:database-optimizer': {
    name: 'database-optimizer',
    description: 'Expert database optimizer specializing in modern performance tuning, query optimization, and scalable architectures. Masters advanced indexing, N+1 resolution, multi-tier caching, partitioning strategies, and cloud database optimization. Handles complex query analysis, migration strategies, and performance monitoring. Use PROACTIVELY for database optimization, performance issues, or scalability challenges.',
    model: 'sonnet',
    capabilities: ['database_cloud_optimization'],
    domain: 'architecture',
    plugin: 'database-cloud-optimization'
  },

  'ultra:sql-pro': {
    name: 'sql-pro',
    description: 'Master modern SQL with cloud-native databases, OLTP/OLAP optimization, and advanced query techniques. Expert in performance tuning, data modeling, and hybrid analytical systems. Use PROACTIVELY for database optimization or complex analysis.',
    model: 'sonnet',
    capabilities: ['database_design'],
    domain: 'architecture',
    plugin: 'database-design'
  },

  'ultra:database-admin': {
    name: 'database-admin',
    description: 'Expert database administrator specializing in modern cloud databases, automation, and reliability engineering. Masters AWS/Azure/GCP database services, Infrastructure as Code, high availability, disaster recovery, performance optimization, and compliance. Handles multi-cloud strategies, container databases, and cost optimization. Use PROACTIVELY for database architecture, operations, or reliability engineering.',
    model: 'sonnet',
    capabilities: ['database_migrations'],
    domain: 'architecture',
    plugin: 'database-migrations'
  },

  'ultra:debugger': {
    name: 'debugger',
    description: 'Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.',
    model: 'sonnet',
    capabilities: ['unit_testing'],
    domain: 'quality',
    plugin: 'unit-testing'
  },

  'ultra:dx-optimizer': {
    name: 'dx-optimizer',
    description: 'Developer Experience specialist. Improves tooling, setup, and workflows. Use PROACTIVELY when setting up new projects, after team feedback, or when development friction is noticed.',
    model: 'sonnet',
    capabilities: ['debugging_toolkit'],
    domain: 'debugging-toolkit',
    plugin: 'debugging-toolkit'
  },

  'ultra:error-detective': {
    name: 'error-detective',
    description: 'Search logs and codebases for error patterns, stack traces, and anomalies. Correlates errors across systems and identifies root causes. Use PROACTIVELY when debugging issues, analyzing logs, or investigating production errors.',
    model: 'sonnet',
    capabilities: ['distributed_debugging'],
    domain: 'operations',
    plugin: 'distributed-debugging'
  },

  'ultra:mermaid-expert': {
    name: 'mermaid-expert',
    description: 'Create Mermaid diagrams for flowcharts, sequences, ERDs, and architectures. Masters syntax for all diagram types and styling. Use PROACTIVELY for visual documentation, system diagrams, or process flows.',
    model: 'haiku',
    capabilities: ['documentation_generation'],
    domain: 'quality',
    plugin: 'documentation-generation'
  },

  'ultra:reference-builder': {
    name: 'reference-builder',
    description: 'Creates exhaustive technical references and API documentation. Generates comprehensive parameter listings, configuration guides, and searchable reference materials. Use PROACTIVELY for API docs, configuration references, or complete technical specifications.',
    model: 'haiku',
    capabilities: ['documentation_generation'],
    domain: 'quality',
    plugin: 'documentation-generation'
  },

  'ultra:dotnet-architect': {
    name: 'dotnet-architect',
    description: 'Expert .NET backend architect specializing in C#, ASP.NET Core, Entity Framework, Dapper, and enterprise application patterns. Masters async/await, dependency injection, caching strategies, and performance optimization. Use PROACTIVELY for .NET API development, code review, or architecture decisions.',
    model: 'sonnet',
    capabilities: ['dotnet_contribution'],
    domain: 'dotnet-contribution',
    plugin: 'dotnet-contribution'
  },

  'ultra:mobile-developer': {
    name: 'mobile-developer',
    description: 'Develop React Native, Flutter, or native mobile apps with modern architecture patterns. Masters cross-platform development, native integrations, offline sync, and app store optimization. Use PROACTIVELY for mobile features, cross-platform code, or app optimization.',
    model: 'sonnet',
    capabilities: ['frontend_mobile_development'],
    domain: 'frontend-mobile-development',
    plugin: 'frontend-mobile-development'
  },

  'ultra:frontend-security-coder': {
    name: 'frontend-security-coder',
    description: 'Expert in secure frontend coding practices specializing in XSS prevention, output sanitization, and client-side security patterns. Use PROACTIVELY for frontend security implementations or client-side security code reviews.',
    model: 'sonnet',
    capabilities: ['frontend_mobile_security'],
    domain: 'security',
    plugin: 'frontend-mobile-security'
  },

  'ultra:mobile-security-coder': {
    name: 'mobile-security-coder',
    description: 'Expert in secure mobile coding practices specializing in input validation, WebView security, and mobile-specific security patterns. Use PROACTIVELY for mobile security implementations or mobile security code reviews.',
    model: 'sonnet',
    capabilities: ['frontend_mobile_security'],
    domain: 'security',
    plugin: 'frontend-mobile-security'
  },

  'ultra:elixir-pro': {
    name: 'elixir-pro',
    description: 'Write idiomatic Elixir code with OTP patterns, supervision trees, and Phoenix LiveView. Masters concurrency, fault tolerance, and distributed systems. Use PROACTIVELY for Elixir refactoring, OTP design, or complex BEAM optimizations.',
    model: 'sonnet',
    capabilities: ['functional_programming'],
    domain: 'functional-programming',
    plugin: 'functional-programming'
  },

  'ultra:haskell-pro': {
    name: 'haskell-pro',
    description: 'Expert Haskell engineer specializing in advanced type systems, pure functional design, and high-reliability software. Use PROACTIVELY for type-level programming, concurrency, and architecture guidance.',
    model: 'sonnet',
    capabilities: ['functional_programming'],
    domain: 'functional-programming',
    plugin: 'functional-programming'
  },

  'ultra:minecraft-bukkit-pro': {
    name: 'minecraft-bukkit-pro',
    description: 'Master Minecraft server plugin development with Bukkit, Spigot, and Paper APIs. Specializes in event-driven architecture, command systems, world manipulation, player management, and performance optimization. Use PROACTIVELY for plugin architecture, gameplay mechanics, server-side features, or cross-version compatibility.',
    model: 'opus',
    capabilities: ['game_development'],
    domain: 'game-development',
    plugin: 'game-development'
  },

  'ultra:unity-developer': {
    name: 'unity-developer',
    description: 'Build Unity games with optimized C# scripts, efficient rendering, and proper asset management. Masters Unity 6 LTS, URP/HDRP pipelines, and cross-platform deployment. Handles gameplay systems, UI implementation, and platform optimization. Use PROACTIVELY for Unity performance issues, game mechanics, or cross-platform builds.',
    model: 'opus',
    capabilities: ['game_development'],
    domain: 'game-development',
    plugin: 'game-development'
  },

  'ultra:hr-pro': {
    name: 'hr-pro',
    description: 'Professional, ethical HR partner for hiring, onboarding/offboarding, PTO and leave, performance, compliant policies, and employee relations. Ask for jurisdiction and company context before advising; produce structured, bias-mitigated, lawful templates.',
    model: 'sonnet',
    capabilities: ['hr_legal_compliance'],
    domain: 'hr-legal-compliance',
    plugin: 'hr-legal-compliance'
  },

  'ultra:legal-advisor': {
    name: 'legal-advisor',
    description: 'Draft privacy policies, terms of service, disclaimers, and legal notices. Creates GDPR-compliant texts, cookie policies, and data processing agreements. Use PROACTIVELY for legal documentation, compliance texts, or regulatory requirements.',
    model: 'sonnet',
    capabilities: ['hr_legal_compliance'],
    domain: 'hr-legal-compliance',
    plugin: 'hr-legal-compliance'
  },

  'ultra:incident-responder': {
    name: 'incident-responder',
    description: 'Expert SRE incident responder specializing in rapid problem resolution, modern observability, and comprehensive incident management. Masters incident command, blameless post-mortems, error budget management, and system reliability patterns. Handles critical outages, communication strategies, and continuous improvement. Use IMMEDIATELY for production incidents or SRE practices.',
    model: 'sonnet',
    capabilities: ['incident_response'],
    domain: 'operations',
    plugin: 'incident-response'
  },

  'ultra:javascript-pro': {
    name: 'javascript-pro',
    description: 'Master modern JavaScript with ES6+, async patterns, and Node.js APIs. Handles promises, event loops, and browser/Node compatibility. Use PROACTIVELY for JavaScript optimization, async debugging, or complex JS patterns.',
    model: 'sonnet',
    capabilities: ['javascript_typescript'],
    domain: 'software-dev',
    plugin: 'javascript-typescript'
  },

  'ultra:typescript-pro': {
    name: 'typescript-pro',
    description: 'Master TypeScript with advanced types, generics, and strict type safety. Handles complex type systems, decorators, and enterprise-grade patterns. Use PROACTIVELY for TypeScript architecture, type inference optimization, or advanced typing patterns.',
    model: 'opus',
    capabilities: ['javascript_typescript'],
    domain: 'software-dev',
    plugin: 'javascript-typescript'
  },

  'ultra:julia-pro': {
    name: 'julia-pro',
    description: 'Master Julia 1.10+ with modern features, performance optimization, multiple dispatch, and production-ready practices. Expert in the Julia ecosystem including package management, scientific computing, and high-performance numerical code. Use PROACTIVELY for Julia development, optimization, or advanced Julia patterns.',
    model: 'sonnet',
    capabilities: ['julia_development'],
    domain: 'julia-development',
    plugin: 'julia-development'
  },

  'ultra:csharp-pro': {
    name: 'csharp-pro',
    description: 'Write modern C# code with advanced features like records, pattern matching, and async/await. Optimizes .NET applications, implements enterprise patterns, and ensures comprehensive testing. Use PROACTIVELY for C# refactoring, performance optimization, or complex .NET solutions.',
    model: 'sonnet',
    capabilities: ['jvm_languages'],
    domain: 'software-dev',
    plugin: 'jvm-languages'
  },

  'ultra:java-pro': {
    name: 'java-pro',
    description: 'Master Java 21+ with modern features like virtual threads, pattern matching, and Spring Boot 3.x. Expert in the latest Java ecosystem including GraalVM, Project Loom, and cloud-native patterns. Use PROACTIVELY for Java development, microservices architecture, or performance optimization.',
    model: 'opus',
    capabilities: ['jvm_languages'],
    domain: 'software-dev',
    plugin: 'jvm-languages'
  },

  'ultra:scala-pro': {
    name: 'scala-pro',
    description: 'Master enterprise-grade Scala development with functional programming, distributed systems, and big data processing. Expert in Apache Pekko, Akka, Spark, ZIO/Cats Effect, and reactive architectures. Use PROACTIVELY for Scala system design, performance optimization, or enterprise integration.',
    model: 'sonnet',
    capabilities: ['jvm_languages'],
    domain: 'software-dev',
    plugin: 'jvm-languages'
  },

  'ultra:ai-engineer': {
    name: 'ai-engineer',
    description: 'Build production-ready LLM applications, advanced RAG systems, and intelligent agents. Implements vector search, multimodal AI, agent orchestration, and enterprise AI integrations. Use PROACTIVELY for LLM features, chatbots, AI agents, or AI-powered applications.',
    model: 'sonnet',
    capabilities: ['llm_application_dev'],
    domain: 'ai-ml',
    plugin: 'llm-application-dev'
  },

  'ultra:prompt-engineer': {
    name: 'prompt-engineer',
    description: 'Expert prompt engineer specializing in advanced prompting techniques, LLM optimization, and AI system design. Masters chain-of-thought, constitutional AI, and production prompt strategies. Use when building AI features, improving agent performance, or crafting system prompts.',
    model: 'sonnet',
    capabilities: ['llm_application_dev'],
    domain: 'ai-ml',
    plugin: 'llm-application-dev'
  },

  'ultra:vector-database-engineer': {
    name: 'vector-database-engineer',
    description: 'Expert in vector databases, embedding strategies, and semantic search implementation. Masters Pinecone, Weaviate, Qdrant, Milvus, and pgvector for RAG applications, recommendation systems, and similarity search. Use PROACTIVELY for vector search implementation, embedding optimization, or semantic retrieval systems.',
    model: 'sonnet',
    capabilities: ['llm_application_dev'],
    domain: 'ai-ml',
    plugin: 'llm-application-dev'
  },

  'ultra:data-scientist': {
    name: 'data-scientist',
    description: 'Expert data scientist for advanced analytics, machine learning, and statistical modeling. Handles complex data analysis, predictive modeling, and business intelligence. Use PROACTIVELY for data analysis tasks, ML modeling, statistical analysis, and data-driven insights.',
    model: 'sonnet',
    capabilities: ['machine_learning_ops'],
    domain: 'ai-ml',
    plugin: 'machine-learning-ops'
  },

  'ultra:ml-engineer': {
    name: 'ml-engineer',
    description: 'Build production ML systems with PyTorch 2.x, TensorFlow, and modern ML frameworks. Implements model serving, feature engineering, A/B testing, and monitoring. Use PROACTIVELY for ML model deployment, inference optimization, or production ML infrastructure.',
    model: 'sonnet',
    capabilities: ['machine_learning_ops'],
    domain: 'ai-ml',
    plugin: 'machine-learning-ops'
  },

  'ultra:mlops-engineer': {
    name: 'mlops-engineer',
    description: 'Build comprehensive ML pipelines, experiment tracking, and model registries with MLflow, Kubeflow, and modern MLOps tools. Implements automated training, deployment, and monitoring across cloud platforms. Use PROACTIVELY for ML infrastructure, experiment management, or pipeline automation.',
    model: 'sonnet',
    capabilities: ['machine_learning_ops'],
    domain: 'ai-ml',
    plugin: 'machine-learning-ops'
  },

  'ultra:flutter-expert': {
    name: 'flutter-expert',
    description: 'Master Flutter development with Dart 3, advanced widgets, and multi-platform deployment. Handles state management, animations, testing, and performance optimization for mobile, web, desktop, and embedded platforms. Use PROACTIVELY for Flutter architecture, UI implementation, or cross-platform features.',
    model: 'sonnet',
    capabilities: ['multi_platform_apps'],
    domain: 'mobile',
    plugin: 'multi-platform-apps'
  },

  'ultra:ios-developer': {
    name: 'ios-developer',
    description: 'Develop native iOS applications with Swift/SwiftUI. Masters iOS 18, SwiftUI, UIKit integration, Core Data, networking, and App Store optimization. Use PROACTIVELY for iOS-specific features, App Store optimization, or native iOS development.',
    model: 'sonnet',
    capabilities: ['multi_platform_apps'],
    domain: 'mobile',
    plugin: 'multi-platform-apps'
  },

  'ultra:ui-ux-designer': {
    name: 'ui-ux-designer',
    description: 'Create interface designs, wireframes, and design systems. Masters user research, accessibility standards, and modern design tools. Specializes in design tokens, component libraries, and inclusive design. Use PROACTIVELY for design systems, user flows, or interface optimization.',
    model: 'sonnet',
    capabilities: ['multi_platform_apps'],
    domain: 'mobile',
    plugin: 'multi-platform-apps'
  },

  'ultra:payment-integration': {
    name: 'payment-integration',
    description: 'Integrate Stripe, PayPal, and payment processors. Handles checkout flows, subscriptions, webhooks, and PCI compliance. Use PROACTIVELY when implementing payments, billing, or subscription features.',
    model: 'sonnet',
    capabilities: ['payment_processing'],
    domain: 'payment-processing',
    plugin: 'payment-processing'
  },

  'ultra:python-pro': {
    name: 'python-pro',
    description: 'Master Python 3.12+ with modern features, async programming, performance optimization, and production-ready practices. Expert in the latest Python ecosystem including uv, ruff, pydantic, and FastAPI. Use PROACTIVELY for Python development, optimization, or advanced Python patterns.',
    model: 'opus',
    capabilities: ['python_development'],
    domain: 'software-dev',
    plugin: 'python-development'
  },

  'ultra:quant-analyst': {
    name: 'quant-analyst',
    description: 'Build financial models, backtest trading strategies, and analyze market data. Implements risk metrics, portfolio optimization, and statistical arbitrage. Use PROACTIVELY for quantitative finance, trading algorithms, or risk analysis.',
    model: 'sonnet',
    capabilities: ['quantitative_trading'],
    domain: 'quantitative-trading',
    plugin: 'quantitative-trading'
  },

  'ultra:risk-manager': {
    name: 'risk-manager',
    description: 'Monitor portfolio risk, R-multiples, and position limits. Creates hedging strategies, calculates expectancy, and implements stop-losses. Use PROACTIVELY for risk assessment, trade tracking, or portfolio protection.',
    model: 'sonnet',
    capabilities: ['quantitative_trading'],
    domain: 'quantitative-trading',
    plugin: 'quantitative-trading'
  },

  'ultra:firmware-analyst': {
    name: 'firmware-analyst',
    description: 'Expert firmware analyst specializing in embedded systems, IoT security, and hardware reverse engineering. Masters firmware extraction, analysis, and vulnerability research for routers, IoT devices, automotive systems, and industrial controllers. Use PROACTIVELY for firmware security audits, IoT penetration testing, or embedded systems research.',
    model: 'opus',
    capabilities: ['reverse_engineering'],
    domain: 'research',
    plugin: 'reverse-engineering'
  },

  'ultra:malware-analyst': {
    name: 'malware-analyst',
    description: 'Expert malware analyst specializing in defensive malware research, threat intelligence, and incident response. Masters sandbox analysis, behavioral analysis, and malware family identification. Handles static/dynamic analysis, unpacking, and IOC extraction. Use PROACTIVELY for malware triage, threat hunting, incident response, or security research.',
    model: 'opus',
    capabilities: ['reverse_engineering'],
    domain: 'research',
    plugin: 'reverse-engineering'
  },

  'ultra:reverse-engineer': {
    name: 'reverse-engineer',
    description: 'Expert reverse engineer specializing in binary analysis, disassembly, decompilation, and software analysis. Masters IDA Pro, Ghidra, radare2, x64dbg, and modern RE toolchains. Handles executable analysis, library inspection, protocol extraction, and vulnerability research. Use PROACTIVELY for binary analysis, CTF challenges, security research, or understanding undocumented software.',
    model: 'opus',
    capabilities: ['reverse_engineering'],
    domain: 'research',
    plugin: 'reverse-engineering'
  },

  'ultra:seo-authority-builder': {
    name: 'seo-authority-builder',
    description: 'Analyzes content for E-E-A-T signals and suggests improvements to build authority and trust. Identifies missing credibility elements. Use PROACTIVELY for YMYL topics.',
    model: 'sonnet',
    capabilities: ['seo_analysis_monitoring'],
    domain: 'marketing',
    plugin: 'seo-analysis-monitoring'
  },

  'ultra:seo-cannibalization-detector': {
    name: 'seo-cannibalization-detector',
    description: 'Analyzes multiple provided pages to identify keyword overlap and potential cannibalization issues. Suggests differentiation strategies. Use PROACTIVELY when reviewing similar content.',
    model: 'haiku',
    capabilities: ['seo_analysis_monitoring'],
    domain: 'marketing',
    plugin: 'seo-analysis-monitoring'
  },

  'ultra:seo-content-refresher': {
    name: 'seo-content-refresher',
    description: 'Identifies outdated elements in provided content and suggests updates to maintain freshness. Finds statistics, dates, and examples that need updating. Use PROACTIVELY for older content.',
    model: 'haiku',
    capabilities: ['seo_analysis_monitoring'],
    domain: 'marketing',
    plugin: 'seo-analysis-monitoring'
  },

  'ultra:seo-content-auditor': {
    name: 'seo-content-auditor',
    description: 'Analyzes provided content for quality, E-E-A-T signals, and SEO best practices. Scores content and provides improvement recommendations based on established guidelines. Use PROACTIVELY for content review.',
    model: 'sonnet',
    capabilities: ['seo_content_creation'],
    domain: 'marketing',
    plugin: 'seo-content-creation'
  },

  'ultra:seo-content-planner': {
    name: 'seo-content-planner',
    description: 'Creates comprehensive content outlines and topic clusters for SEO. Plans content calendars and identifies topic gaps. Use PROACTIVELY for content strategy and planning.',
    model: 'haiku',
    capabilities: ['seo_content_creation'],
    domain: 'marketing',
    plugin: 'seo-content-creation'
  },

  'ultra:seo-content-writer': {
    name: 'seo-content-writer',
    description: 'Writes SEO-optimized content based on provided keywords and topic briefs. Creates engaging, comprehensive content following best practices. Use PROACTIVELY for content creation tasks.',
    model: 'sonnet',
    capabilities: ['seo_content_creation'],
    domain: 'marketing',
    plugin: 'seo-content-creation'
  },

  'ultra:seo-keyword-strategist': {
    name: 'seo-keyword-strategist',
    description: 'Analyzes keyword usage in provided content, calculates density, suggests semantic variations and LSI keywords based on the topic. Prevents over-optimization. Use PROACTIVELY for content optimization.',
    model: 'haiku',
    capabilities: ['seo_technical_optimization'],
    domain: 'marketing',
    plugin: 'seo-technical-optimization'
  },

  'ultra:seo-meta-optimizer': {
    name: 'seo-meta-optimizer',
    description: 'Creates optimized meta titles, descriptions, and URL suggestions based on character limits and best practices. Generates compelling, keyword-rich metadata. Use PROACTIVELY for new content.',
    model: 'haiku',
    capabilities: ['seo_technical_optimization'],
    domain: 'marketing',
    plugin: 'seo-technical-optimization'
  },

  'ultra:seo-snippet-hunter': {
    name: 'seo-snippet-hunter',
    description: 'Formats content to be eligible for featured snippets and SERP features. Creates snippet-optimized content blocks based on best practices. Use PROACTIVELY for question-based content.',
    model: 'haiku',
    capabilities: ['seo_technical_optimization'],
    domain: 'marketing',
    plugin: 'seo-technical-optimization'
  },

  'ultra:seo-structure-architect': {
    name: 'seo-structure-architect',
    description: 'Analyzes and optimizes content structure including header hierarchy, suggests schema markup, and internal linking opportunities. Creates search-friendly content organization. Use PROACTIVELY for content structuring.',
    model: 'haiku',
    capabilities: ['seo_technical_optimization'],
    domain: 'marketing',
    plugin: 'seo-technical-optimization'
  },

  'ultra:bash-pro': {
    name: 'bash-pro',
    description: 'Master of defensive Bash scripting for production automation, CI/CD pipelines, and system utilities. Expert in safe, portable, and testable shell scripts.',
    model: 'sonnet',
    capabilities: ['shell_scripting'],
    domain: 'automation',
    plugin: 'shell-scripting'
  },

  'ultra:posix-shell-pro': {
    name: 'posix-shell-pro',
    description: 'Expert in strict POSIX sh scripting for maximum portability across Unix-like systems. Specializes in shell scripts that run on any POSIX-compliant shell (dash, ash, sh, bash --posix).',
    model: 'sonnet',
    capabilities: ['shell_scripting'],
    domain: 'automation',
    plugin: 'shell-scripting'
  },

  'ultra:startup-analyst': {
    name: 'startup-analyst',
    description: 'Expert startup business analyst specializing in market sizing, financial modeling, competitive analysis, and strategic planning for early-stage companies. Use PROACTIVELY when the user asks about market opportunity, TAM/SAM/SOM, financial projections, unit economics, competitive landscape, team planning, startup metrics, or business strategy for pre-seed through Series A startups.',
    model: 'sonnet',
    capabilities: ['startup_business_analyst'],
    domain: 'startup-business-analyst',
    plugin: 'startup-business-analyst'
  },

  'ultra:c-pro': {
    name: 'c-pro',
    description: 'Write efficient C code with proper memory management, pointer arithmetic, and system calls. Handles embedded systems, kernel modules, and performance-critical code. Use PROACTIVELY for C optimization, memory issues, or system programming.',
    model: 'opus',
    capabilities: ['systems_programming'],
    domain: 'software-dev',
    plugin: 'systems-programming'
  },

  'ultra:cpp-pro': {
    name: 'cpp-pro',
    description: 'Write idiomatic C++ code with modern features, RAII, smart pointers, and STL algorithms. Handles templates, move semantics, and performance optimization. Use PROACTIVELY for C++ refactoring, memory safety, or complex C++ patterns.',
    model: 'opus',
    capabilities: ['systems_programming'],
    domain: 'software-dev',
    plugin: 'systems-programming'
  },

  'ultra:golang-pro': {
    name: 'golang-pro',
    description: 'Master Go 1.21+ with modern patterns, advanced concurrency, performance optimization, and production-ready microservices. Expert in the latest Go ecosystem including generics, workspaces, and cutting-edge frameworks. Use PROACTIVELY for Go development, architecture design, or performance optimization.',
    model: 'opus',
    capabilities: ['systems_programming'],
    domain: 'software-dev',
    plugin: 'systems-programming'
  },

  'ultra:rust-pro': {
    name: 'rust-pro',
    description: 'Master Rust 1.75+ with modern async patterns, advanced type system features, and production-ready systems programming. Expert in the latest Rust ecosystem including Tokio, axum, and cutting-edge crates. Use PROACTIVELY for Rust development, performance optimization, or systems programming.',
    model: 'opus',
    capabilities: ['systems_programming'],
    domain: 'software-dev',
    plugin: 'systems-programming'
  },

  'ultra:accessibility-expert': {
    name: 'accessibility-expert',
    description: 'Expert accessibility specialist ensuring WCAG compliance, inclusive design, and assistive technology compatibility. Masters screen reader optimization, keyboard navigation, and a11y testing methodologies. Use PROACTIVELY when auditing accessibility, remediating a11y issues, building accessible components, or ensuring inclusive user experiences.',
    model: 'sonnet',
    capabilities: ['ui_design'],
    domain: 'design',
    plugin: 'ui-design'
  },

  'ultra:design-system-architect': {
    name: 'design-system-architect',
    description: 'Expert design system architect specializing in design tokens, component libraries, theming infrastructure, and scalable design operations. Masters token architecture, multi-brand systems, and design-development collaboration. Use PROACTIVELY when building design systems, creating token architectures, implementing theming, or establishing component libraries.',
    model: 'sonnet',
    capabilities: ['ui_design'],
    domain: 'design',
    plugin: 'ui-design'
  },

  'ultra:ui-designer': {
    name: 'ui-designer',
    description: 'Expert UI designer specializing in component creation, layout systems, and visual design implementation. Masters modern design patterns, responsive layouts, and design-to-code workflows. Use PROACTIVELY when building UI components, designing layouts, creating mockups, or implementing visual designs.',
    model: 'sonnet',
    capabilities: ['ui_design'],
    domain: 'design',
    plugin: 'ui-design'
  },

  'ultra:php-pro': {
    name: 'php-pro',
    description: 'Write idiomatic PHP code with generators, iterators, SPL data structures, and modern OOP features. Use PROACTIVELY for high-performance PHP applications.',
    model: 'sonnet',
    capabilities: ['web_scripting'],
    domain: 'automation',
    plugin: 'web-scripting'
  },

  'ultra:ruby-pro': {
    name: 'ruby-pro',
    description: 'Write idiomatic Ruby code with metaprogramming, Rails patterns, and performance optimization. Specializes in Ruby on Rails, gem development, and testing frameworks. Use PROACTIVELY for Ruby refactoring, optimization, or complex Ruby features.',
    model: 'sonnet',
    capabilities: ['web_scripting'],
    domain: 'automation',
    plugin: 'web-scripting'
  },

};

export const AGENTS_BY_DOMAIN: Record<string, string[]> = {
  'agent-teams': ['ultra:team-debugger', 'ultra:team-implementer', 'ultra:team-lead', 'ultra:team-reviewer'],
  'ai-ml': ['ultra:context-manager', 'ultra:ai-engineer', 'ultra:prompt-engineer', 'ultra:vector-database-engineer', 'ultra:data-scientist', 'ultra:ml-engineer', 'ultra:mlops-engineer'],
  'architecture': ['ultra:c4-code', 'ultra:c4-component', 'ultra:c4-container', 'ultra:c4-context', 'ultra:deployment-engineer', 'ultra:hybrid-cloud-architect', 'ultra:network-engineer', 'ultra:database-architect', 'ultra:database-optimizer', 'ultra:sql-pro', 'ultra:database-admin'],
  'arm-cortex-microcontrollers': ['ultra:arm-cortex-expert'],
  'automation': ['ultra:bash-pro', 'ultra:posix-shell-pro', 'ultra:php-pro', 'ultra:ruby-pro'],
  'blockchain-web3': ['ultra:blockchain-developer'],
  'conductor': ['ultra:conductor-validator'],
  'customer-sales-automation': ['ultra:customer-support', 'ultra:sales-automator'],
  'data': ['ultra:business-analyst', 'ultra:data-engineer'],
  'debugging-toolkit': ['ultra:dx-optimizer'],
  'design': ['ultra:ui-visual-validator', 'ultra:accessibility-expert', 'ultra:design-system-architect', 'ultra:ui-designer'],
  'dotnet-contribution': ['ultra:dotnet-architect'],
  'frontend-mobile-development': ['ultra:mobile-developer'],
  'functional-programming': ['ultra:elixir-pro', 'ultra:haskell-pro'],
  'game-development': ['ultra:minecraft-bukkit-pro', 'ultra:unity-developer'],
  'hr-legal-compliance': ['ultra:hr-pro', 'ultra:legal-advisor'],
  'julia-development': ['ultra:julia-pro'],
  'marketing': ['ultra:content-marketer', 'ultra:search-specialist', 'ultra:seo-authority-builder', 'ultra:seo-cannibalization-detector', 'ultra:seo-content-refresher', 'ultra:seo-content-auditor', 'ultra:seo-content-planner', 'ultra:seo-content-writer', 'ultra:seo-keyword-strategist', 'ultra:seo-meta-optimizer', 'ultra:seo-snippet-hunter', 'ultra:seo-structure-architect'],
  'mobile': ['ultra:flutter-expert', 'ultra:ios-developer', 'ultra:ui-ux-designer'],
  'operations': ['ultra:observability-engineer', 'ultra:error-detective', 'ultra:incident-responder'],
  'payment-processing': ['ultra:payment-integration'],
  'quality': ['ultra:api-documenter', 'ultra:docs-architect', 'ultra:tutorial-engineer', 'ultra:architect-review', 'ultra:debugger', 'ultra:mermaid-expert', 'ultra:reference-builder'],
  'quantitative-trading': ['ultra:quant-analyst', 'ultra:risk-manager'],
  'research': ['ultra:firmware-analyst', 'ultra:malware-analyst', 'ultra:reverse-engineer'],
  'security': ['ultra:frontend-developer', 'ultra:backend-security-coder', 'ultra:frontend-security-coder', 'ultra:mobile-security-coder'],
  'software-dev': ['ultra:backend-architect', 'ultra:django-pro', 'ultra:fastapi-pro', 'ultra:graphql-architect', 'ultra:performance-engineer', 'ultra:event-sourcing-architect', 'ultra:security-auditor', 'ultra:tdd-orchestrator', 'ultra:temporal-python-pro', 'ultra:test-automator', 'ultra:cloud-architect', 'ultra:devops-troubleshooter', 'ultra:kubernetes-architect', 'ultra:terraform-specialist', 'ultra:code-reviewer', 'ultra:legacy-modernizer', 'ultra:javascript-pro', 'ultra:typescript-pro', 'ultra:csharp-pro', 'ultra:java-pro', 'ultra:scala-pro', 'ultra:python-pro', 'ultra:c-pro', 'ultra:cpp-pro', 'ultra:golang-pro', 'ultra:rust-pro'],
  'startup-business-analyst': ['ultra:startup-analyst'],
};

export const TOTAL_AGENTS = 109;
export const TOTAL_DOMAINS = 27;

/**
 * Load wshobson agents (now statically included)
 * 
 * All agents-lib agents have been pre-loaded into AGENT_CATALOG.
 * This function exists for compatibility and returns the count.
 * 
 * @returns Number of agents-lib agents in catalog
 */
export async function loadWshobsonAgents(
  pluginsDir: string = './agents-lib/plugins'
): Promise<number> {
  const wshobsonAgents = Object.values(AGENT_CATALOG).filter(agent => 
    agent.plugin !== 'core'
  );
  
  console.log(`[UltraPilot] Agent catalog includes ${wshobsonAgents.length} agents-lib agents`);
  console.log(`[UltraPilot] All agents pre-loaded - no dynamic loading required`);
  
  return wshobsonAgents.length;
}

/**
 * Initialize UltraPilot with all agents
 *
 * All agents are statically loaded in AGENT_CATALOG.
 * This function logs initialization status and returns agent count.
 * 
 * @param options - Configuration options (for compatibility)
 * @returns Total number of agents available
 */
export async function initializeUltraPilot(options?: {
  loadWshobson?: boolean;
  wshobsonPluginsDir?: string;
}): Promise<number> {
  console.log('[UltraPilot] Agent catalog ready...');
  
  const total = Object.keys(AGENT_CATALOG).length;
  console.log(`[UltraPilot] ${TOTAL_AGENTS} unique agents across ${TOTAL_DOMAINS} domains`);
  console.log(`[UltraPilot] All agents statically loaded - no initialization required`);
  
  return total;
}

/**
 * Auto-initialize UltraPilot when module loads (optional convenience)
 *
 * This is automatically called when the agents module is imported,
 * unless ULTRAPILOT_AUTO_INIT env var is set to 'false'.
 *
 * To disable auto-initialization:
 *   ULTRAPILOT_AUTO_INIT=false node your-app.js
 */
let _initialized = false;
export async function ensureInitialized(): Promise<number> {
  if (!_initialized) {
    const autoInit = process.env.ULTRAPILOT_AUTO_INIT !== 'false';
    if (autoInit) {
      const total = await initializeUltraPilot();
      _initialized = true;
      return total;
    }
  }
  return Object.keys(AGENT_CATALOG).length;
}
