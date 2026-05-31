using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class WorkItemServiceTests
{
    private static readonly DateOnly Today = new(2026, 5, 31);

    [Fact]
    public void Create_rejects_blank_title_invalid_priority_and_past_due_date()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("   ", "Valid description", 7, Today.AddDays(-1));

        var result = service.Create(request);

        Assert.False(result.Succeeded);
        Assert.Collection(
            result.Errors,
            error => Assert.Equal(nameof(CreateWorkItemRequest.Title), error.Code),
            error => Assert.Equal(nameof(CreateWorkItemRequest.Priority), error.Code),
            error => Assert.Equal(nameof(CreateWorkItemRequest.DueDate), error.Code));
    }

    [Fact]
    public void Create_trims_fields_and_adds_new_todo_item()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("  Draft release notes  ", "  Include workflow caveats.  ", 3, Today.AddDays(3));

        var result = service.Create(request);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Value);
        Assert.Equal("Draft release notes", result.Value.Title);
        Assert.Equal("Include workflow caveats.", result.Value.Description);
        Assert.Equal(WorkItemStatus.Todo, result.Value.Status);
        Assert.Contains(service.GetAll(), item => item.Id == result.Value.Id);
    }

    [Fact]
    public void Summary_counts_open_done_overdue_and_high_priority_items()
    {
        var service = CreateService();
        service.Create(new CreateWorkItemRequest("Customer escalation", null, 5, Today));

        var summary = service.GetSummary();

        Assert.Equal(5, summary.Total);
        Assert.Equal(4, summary.Open);
        Assert.Equal(1, summary.Done);
        Assert.Equal(0, summary.Overdue);
        Assert.Equal(3, summary.HighPriorityOpen);
        Assert.Equal("Needs attention", summary.Health);
    }

    private static WorkItemService CreateService() => new(new FixedDateProvider(Today));
}
