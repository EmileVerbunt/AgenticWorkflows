namespace AgenticWorkflows.Api.Models;

public sealed record WorkItem(
    Guid Id,
    string Title,
    string? Description,
    int Priority,
    WorkItemStatus Status,
    DateOnly? DueDate);
