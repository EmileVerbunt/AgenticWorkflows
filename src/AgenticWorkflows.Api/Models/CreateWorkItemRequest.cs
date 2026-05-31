namespace AgenticWorkflows.Api.Models;

public sealed record CreateWorkItemRequest(
    string Title,
    string? Description,
    int Priority,
    DateOnly? DueDate);
