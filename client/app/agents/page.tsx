import type { Metadata } from "next";

import { AgentsView } from "@/features/agents/components/agents-view";

export const metadata: Metadata = {
  title: "Agent Monitoring — AgentVox",
  description:
    "Real-time multi-agent observability with workflow traces, latency, resources, and execution logs.",
};

export default function AgentMonitoringPage() {
  return <AgentsView />;
}
