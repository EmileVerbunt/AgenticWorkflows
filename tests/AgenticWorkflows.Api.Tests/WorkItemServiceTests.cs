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

    [Fact]
    public void Create_rejects_title_exceeding_80_characters()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest(new string('a', 81), null, 3, Today);

        var result = service.Create(request);

        Assert.False(result.Succeeded);
        Assert.Single(result.Errors, e => e.Code == nameof(CreateWorkItemRequest.Title));
    }

    [Fact]
    public void Create_rejects_description_exceeding_240_characters()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Valid title", new string('b', 241), 3, Today);

        var result = service.Create(request);

        Assert.False(result.Succeeded);
        Assert.Single(result.Errors, e => e.Code == nameof(CreateWorkItemRequest.Description));
    }

    [Fact]
    public void Create_accepts_due_date_equal_to_today()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Due today", null, 1, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
        Assert.Equal(Today, result.Value!.DueDate);
    }

    [Fact]
    public void Create_stores_null_description_for_whitespace_only_input()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Title", "   ", 2, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
        Assert.Null(result.Value!.Description);
    }

    [Fact]
    public void Summary_health_is_healthy_when_no_overdue_and_at_most_two_high_priority_open()
    {
        // Seed has 2 high-priority open items (p4 InProgress + p5 Todo) and 0 overdue — "Healthy"
        var service = CreateService();

        var summary = service.GetSummary();

        Assert.Equal("Healthy", summary.Health);
    }

    [Fact]
    public void Find_returns_item_for_known_id()
    {
        var service = CreateService();
        var created = service.Create(new CreateWorkItemRequest("Findable", null, 1, Today)).Value!;

        var found = service.Find(created.Id);

        Assert.NotNull(found);
        Assert.Equal(created.Id, found.Id);
    }

    [Fact]
    public void Find_returns_null_for_unknown_id()
    {
        var service = CreateService();

        var result = service.Find(Guid.NewGuid());

        Assert.Null(result);
    }

    private static WorkItemService CreateService() => new(new FixedDateProvider(Today));
}
