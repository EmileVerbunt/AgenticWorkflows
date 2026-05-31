namespace AgenticWorkflows.Api.Models;

public sealed record WorkItemSummary(
    int Total,
    int Open,
    int Done,
    int Overdue,
    int HighPriorityOpen,
    string Health);
