import { PrismaClient, UserRole, OrgRole, WorkflowStatus, ExecutionStatus, ApprovalStatus, IntegrationProvider, ChannelType, MessageRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Axiom Logic database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.humanApproval.deleteMany();
  await prisma.executionLog.deleteMany();
  await prisma.workflowExecution.deleteMany();
  await prisma.workflowNode.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.toolCall.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.knowledgeSource.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.booking.deleteMany();

  // 1. Organization
  const org = await prisma.organization.create({
    data: {
      name: "Acme Operations",
      slug: "acme-ops",
      plan: "Enterprise Scale",
    },
  });

  // 2. Users
  const ownerUser = await prisma.user.create({
    data: {
      email: "marcus@acme.com",
      passwordHash: "scrypt_mock_hashed_secure_password_123",
      name: "Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: UserRole.ADMIN,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "elena@acme.com",
      passwordHash: "scrypt_mock_hashed_secure_password_123",
      name: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      role: UserRole.ADMIN,
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      email: "david@acme.com",
      passwordHash: "scrypt_mock_hashed_secure_password_123",
      name: "David Chen",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      role: UserRole.USER,
    },
  });

  // 3. Memberships
  await prisma.membership.createMany({
    data: [
      { userId: ownerUser.id, organizationId: org.id, role: OrgRole.OWNER },
      { userId: adminUser.id, organizationId: org.id, role: OrgRole.ADMIN },
      { userId: memberUser.id, organizationId: org.id, role: OrgRole.MEMBER },
    ],
  });

  // 4. Agents
  const supportAgent = await prisma.agent.create({
    data: {
      organizationId: org.id,
      name: "Customer Support Agent",
      role: "Customer Operations Specialist",
      model: "gpt-4o",
      temperature: 0.1,
      instructions: "Handle order tracking, address updates, order cancellations, and return policy evaluations. Cross-reference Postgres database. If refund exceeds $100 or user expresses critical frustration, flag for Human Approval.",
      tools: JSON.stringify([
        { name: "query_order_status", description: "Fetch order details by order_id from database" },
        { name: "mutate_shipping_address", description: "Safely update shipping destination address before carrier dispatch" },
        { name: "evaluate_refund_policy", description: "Evaluate whether an order is eligible for immediate automated refund" },
        { name: "create_human_escalation", description: "Route edge-case requests to human supervisor queue" }
      ]),
      status: "ACTIVE",
    },
  });

  const leadAgent = await prisma.agent.create({
    data: {
      organizationId: org.id,
      name: "Lead Qualification Agent",
      role: "Inbound Revenue Velocity",
      model: "claude-3-5-sonnet",
      temperature: 0.2,
      instructions: "Ingest inbound enterprise lead signals, enrich firmographic metrics via Apollo/Clearbit, compute ICP score, update CRM, and book dedicated AE calendar intervals.",
      tools: JSON.stringify([
        { name: "enrich_firmographics", description: "Look up company headcount, revenue band, and tech stack" },
        { name: "calculate_icp_score", description: "Score fit from 0 to 100 based on enterprise criteria" },
        { name: "reserve_calendar_slot", description: "Lock Account Executive calendar slot in real-time" }
      ]),
      status: "ACTIVE",
    },
  });

  const opsAgent = await prisma.agent.create({
    data: {
      organizationId: org.id,
      name: "Operations Assistant",
      role: "Internal Governance & IT",
      model: "gpt-4o",
      temperature: 0.0,
      instructions: "Execute IT provisioning, contractor onboarding checklists, hardware allocations, and financial invoice reconciliation under strict SOX and ISO27001 policies.",
      tools: JSON.stringify([
        { name: "provision_okta_user", description: "Create identity directory user with role scopes" },
        { name: "match_invoice_po", description: "Reconcile vendor invoice against ERP purchase order" }
      ]),
      status: "ACTIVE",
    },
  });

  // 5. Workflows
  const orderWorkflow = await prisma.workflow.create({
    data: {
      organizationId: org.id,
      name: "Order Status & Mutation Flow",
      description: "Autonomous ingestion of customer order queries, delivery tracking lookup, and destination address mutations.",
      status: WorkflowStatus.ACTIVE,
      triggerType: "WEBHOOK",
      definitionJson: JSON.stringify({
        nodes: [
          { id: "node-1", type: "Trigger", label: "Incoming Customer Message", position: { x: 50, y: 150 } },
          { id: "node-2", type: "AI Agent", label: "Intent & Entity Extraction", agentId: supportAgent.id, position: { x: 300, y: 150 } },
          { id: "node-3", type: "Condition", label: "Policy Constraint Check", position: { x: 550, y: 150 } },
          { id: "node-4", type: "Database", label: "Query/Mutate PostgreSQL", position: { x: 800, y: 100 } },
          { id: "node-5", type: "Response", label: "Verified Multi-Channel Reply", position: { x: 1050, y: 150 } }
        ],
        connections: [
          { from: "node-1", to: "node-2" },
          { from: "node-2", to: "node-3" },
          { from: "node-3", to: "node-4" },
          { from: "node-4", to: "node-5" }
        ]
      }),
    },
  });

  const refundWorkflow = await prisma.workflow.create({
    data: {
      organizationId: org.id,
      name: "Customer Financial Refund Flow",
      description: "Policy-evaluated refund requests with automated human-in-the-loop approval escalation for thresholds > $100.",
      status: WorkflowStatus.ACTIVE,
      triggerType: "WEBHOOK",
      definitionJson: JSON.stringify({
        nodes: [
          { id: "rf-1", type: "Trigger", label: "Refund Request Ingestion", position: { x: 50, y: 150 } },
          { id: "rf-2", type: "AI Agent", label: "Evaluate Receipt & Reason", position: { x: 300, y: 150 } },
          { id: "rf-3", type: "Condition", label: "Amount > $100?", position: { x: 550, y: 150 } },
          { id: "rf-4", type: "Human Approval", label: "Supervisor Review Queue", position: { x: 800, y: 220 } },
          { id: "rf-5", type: "API", label: "Stripe Refund API", position: { x: 1050, y: 150 } }
        ]
      }),
    },
  });

  const leadWorkflow = await prisma.workflow.create({
    data: {
      organizationId: org.id,
      name: "Inbound Lead Qualification & CRM Sync",
      description: "Real-time enrichment of demo requests, qualification scoring, and CRM pipeline assignment.",
      status: WorkflowStatus.ACTIVE,
      triggerType: "FORM_SUBMIT",
      definitionJson: JSON.stringify({
        nodes: [
          { id: "ld-1", type: "Trigger", label: "Demo Form Submitted", position: { x: 50, y: 150 } },
          { id: "ld-2", type: "API", label: "Enrich Apollo Firmographics", position: { x: 300, y: 150 } },
          { id: "ld-3", type: "AI Agent", label: "Calculate ICP Match", position: { x: 550, y: 150 } },
          { id: "ld-4", type: "Database", label: "Update HubSpot Pipeline", position: { x: 800, y: 150 } },
          { id: "ld-5", type: "Email", label: "Dispatch Calendar Invite", position: { x: 1050, y: 150 } }
        ]
      }),
    },
  });

  // 6. Workflow Executions & Logs
  // Execution 1: Completed order lookup
  const exec1 = await prisma.workflowExecution.create({
    data: {
      workflowId: orderWorkflow.id,
      organizationId: org.id,
      status: ExecutionStatus.COMPLETED,
      durationMs: 412,
      inputData: JSON.stringify({ raw_message: "Where is my order #GC1024?", channel: "WHATSAPP" }),
      outputData: JSON.stringify({
        order_id: "GC-1024",
        status: "IN_TRANSIT",
        hub: "Town Distribution Center → Village Delivery Hub",
        eta: "Today, 3:45 PM",
        response_sent: "Your order has reached the town hub and is scheduled for village delivery today."
      }),
      startedAt: new Date(Date.now() - 1000 * 60 * 12),
      completedAt: new Date(Date.now() - 1000 * 60 * 12 + 412),
    },
  });

  await prisma.executionLog.createMany({
    data: [
      { executionId: exec1.id, stepName: "Webhook received", level: "INFO", message: "Inbound WhatsApp payload received from +1-555-019-2834", latencyMs: 14 },
      { executionId: exec1.id, stepName: "Request classified", level: "INFO", message: "Extracted intent: QUERY_ORDER_STATUS with 99.8% confidence", latencyMs: 42 },
      { executionId: exec1.id, stepName: "Customer identified", level: "INFO", message: "UUID verified against customer table: user_9824_vance", latencyMs: 32 },
      { executionId: exec1.id, stepName: "Order found", level: "INFO", message: "Fetched order GC-1024. Status: IN_TRANSIT, Hub: Town Hub", latencyMs: 88 },
      { executionId: exec1.id, stepName: "Delivery status checked", level: "INFO", message: "Courier driver Unit #402 confirms delivery window today 3:45 PM", latencyMs: 148 },
      { executionId: exec1.id, stepName: "Response generated", level: "INFO", message: "Dispatched verified response via WhatsApp API (200 OK)", latencyMs: 88 },
    ],
  });

  // Execution 2: Waiting for human approval
  const exec2 = await prisma.workflowExecution.create({
    data: {
      workflowId: refundWorkflow.id,
      organizationId: org.id,
      status: ExecutionStatus.WAITING_FOR_HUMAN,
      durationMs: 245,
      inputData: JSON.stringify({ order_id: "GC-1024", refund_amount: 340.00, reason: "Customer requested cancellation prior to carrier dispatch" }),
      outputData: JSON.stringify({ recommendation: "Refund customer ₹1,499 ($340.00)", pending_supervisor: true }),
      startedAt: new Date(Date.now() - 1000 * 60 * 25),
    },
  });

  await prisma.executionLog.createMany({
    data: [
      { executionId: exec2.id, stepName: "Webhook received", level: "INFO", message: "Cancellation request received from customer care portal", latencyMs: 12 },
      { executionId: exec2.id, stepName: "Policy evaluated", level: "WARN", message: "Refund amount $340.00 exceeds autonomous bot limit ($100.00)", latencyMs: 85 },
      { executionId: exec2.id, stepName: "Human Approval Created", level: "WARN", message: "Workflow paused. Escalation ticket generated for Billing Lead.", latencyMs: 148 },
    ],
  });

  // Execution 3: Completed Lead Qualification
  const exec3 = await prisma.workflowExecution.create({
    data: {
      workflowId: leadWorkflow.id,
      organizationId: org.id,
      status: ExecutionStatus.COMPLETED,
      durationMs: 380,
      inputData: JSON.stringify({ email: "cto@fintechscale.io", company: "FintechScale", employees: "250-500" }),
      outputData: JSON.stringify({ icp_score: 96, routing: "Enterprise AE - West", cal_link_dispatched: true }),
      startedAt: new Date(Date.now() - 1000 * 60 * 60),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 + 380),
    },
  });

  // 7. Human Approvals
  await prisma.humanApproval.create({
    data: {
      executionId: exec2.id,
      organizationId: org.id,
      status: ApprovalStatus.PENDING,
      title: "Refund customer ₹1,499 ($340.00)",
      description: "Customer requested order cancellation for #GC1024. Item is currently in Town Distribution Hub and packaging has not been broken.",
      proposedAction: "Execute Stripe API refund of $340.00 and notify courier to return package to warehouse inventory.",
    },
  });

  await prisma.humanApproval.create({
    data: {
      executionId: exec2.id,
      organizationId: org.id,
      status: ApprovalStatus.PENDING,
      title: "VIP Overnight Courier Override",
      description: "Priority enterprise customer requesting expedited air shipping on Order #AX-8914 outside normal carrier contract tier.",
      proposedAction: "Authorize $45 courier surcharge waiver and dispatch Priority Air waybill.",
    },
  });

  // 8. Integrations
  await prisma.integration.createMany({
    data: [
      { organizationId: org.id, provider: IntegrationProvider.CRM, name: "HubSpot Enterprise", status: "CONNECTED", configJson: JSON.stringify({ portalId: "492019", syncInterval: "Real-time Webhook" }) },
      { organizationId: org.id, provider: IntegrationProvider.DATABASE, name: "PostgreSQL Production", status: "CONNECTED", configJson: JSON.stringify({ host: "localhost", database: "orders_prod", poolSize: 20 }) },
      { organizationId: org.id, provider: IntegrationProvider.WHATSAPP, name: "Meta WhatsApp Cloud API", status: "CONNECTED", configJson: JSON.stringify({ phoneId: "+1-555-019-2834", webhookStatus: "Active" }) },
      { organizationId: org.id, provider: IntegrationProvider.EMAIL, name: "SendGrid Dedicated IP", status: "CONNECTED", configJson: JSON.stringify({ sender: "ops@axiomlogic.com", templateCount: 12 }) },
      { organizationId: org.id, provider: IntegrationProvider.CALENDAR, name: "Google Calendar Workspace", status: "CONNECTED", configJson: JSON.stringify({ calendarId: "primary", conflictDetection: true }) },
      { organizationId: org.id, provider: IntegrationProvider.N8N, name: "n8n Self-Hosted Cluster", status: "CONNECTED", configJson: JSON.stringify({ webhookUrl: "https://automation.axiomlogic.com/webhook", activeWorkflows: 8 }) },
      { organizationId: org.id, provider: IntegrationProvider.WEBHOOK, name: "Custom Inbound Webhooks", status: "CONNECTED", configJson: JSON.stringify({ signatureKey: "sec_live_9a8f***", rateLimitRps: 100 }) },
    ],
  });

  // 9. Conversations & Messages
  const conversation = await prisma.conversation.create({
    data: {
      organizationId: org.id,
      customerId: "cust_7721",
      customerName: "Alex Morgan",
      channel: ChannelType.WEB_CHAT,
      status: "ACTIVE",
    },
  });

  const msg1 = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: MessageRole.USER,
      content: "Where is my order #GC1024?",
    },
  });

  const msg2 = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: MessageRole.ASSISTANT,
      content: "Your order has reached the town hub and is scheduled for village delivery today.",
    },
  });

  await prisma.toolCall.create({
    data: {
      messageId: msg2.id,
      toolName: "query_order_status",
      inputJson: JSON.stringify({ order_id: "GC-1024" }),
      outputJson: JSON.stringify({ status: "Town Hub", next_step: "Village Delivery", eta: "Today" }),
      status: "SUCCESS",
      durationMs: 88,
    },
  });

  // 10. Bookings
  await prisma.booking.createMany({
    data: [
      {
        name: "Marcus Vance",
        email: "marcus@hypergrowth.io",
        company: "Hypergrowth Inc",
        date: "Tue, Apr 22",
        timeSlot: "10:00 AM EST",
        workflowType: "Customer Operations",
        description: "We handle ~800 order change requests per week manually in Zendesk and Postgres. Looking to automate safe changes without customer churn.",
        status: "CONFIRMED",
      },
      {
        name: "Sarah Lin",
        email: "sarah@apexlogistics.com",
        company: "Apex Logistics",
        date: "Wed, Apr 23",
        timeSlot: "02:00 PM EST",
        workflowType: "Internal Operations",
        description: "Automate driver dispatch exceptions and fuel surcharge reconciliation against ERP invoices.",
        status: "CONFIRMED",
      }
    ],
  });

  // 11. Notifications
  await prisma.notification.createMany({
    data: [
      {
        organizationId: org.id,
        userId: ownerUser.id,
        title: "Human Attention Required",
        message: "Order #GC1024 refund request ($340.00) is awaiting supervisor approval.",
        type: "ESCALATION",
        read: false,
      },
      {
        organizationId: org.id,
        userId: ownerUser.id,
        title: "Pipeline Telemetry Verified",
        message: "Order mutation workflow reached 99.98% autonomous execution over the last 24h.",
        type: "SYSTEM",
        read: true,
      }
    ],
  });

  console.log("✅ Seed completed successfully! Organization 'Acme Operations' and demo records created.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
