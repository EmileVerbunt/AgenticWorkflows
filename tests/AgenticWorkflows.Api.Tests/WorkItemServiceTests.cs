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

    // ── Validation boundaries ───────────────────────────────────────────────

    [Fact]
    public void Create_accepts_title_of_exactly_80_characters()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest(new string('a', 80), null, 3, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Create_rejects_title_of_81_characters()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest(new string('a', 81), null, 3, Today);

        var result = service.Create(request);

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Code == nameof(CreateWorkItemRequest.Title));
    }

    [Fact]
    public void Create_accepts_description_of_exactly_240_characters()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Title", new string('d', 240), 3, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Create_rejects_description_of_241_characters()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Title", new string('d', 241), 3, Today);

        var result = service.Create(request);

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Code == nameof(CreateWorkItemRequest.Description));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(5)]
    public void Create_accepts_priority_at_boundaries(int priority)
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Title", null, priority, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Create_accepts_due_date_equal_to_today()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Title", null, 3, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Create_stores_null_description_when_input_is_whitespace_only()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Title", "   ", 3, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
        Assert.Null(result.Value!.Description);
    }

    // ── GetAll ordering ─────────────────────────────────────────────────────

    [Fact]
    public void GetAll_orders_by_priority_descending_then_due_date_ascending()
    {
        var service = CreateService();
        // Seed already has priority 5 (due +1), 4 (due +2), 3 (due +5), 2 (done, due -1)
        // Add a second priority-4 item due later than the existing one to verify secondary sort.
        service.Create(new CreateWorkItemRequest("Later high-pri", null, 4, Today.AddDays(7)));

        var items = service.GetAll().ToArray();

        // Priority 5 must come first.
        Assert.Equal(5, items[0].Priority);
        // Both priority-4 items come before priority-3.
        var priority4 = items.Where(i => i.Priority == 4).ToArray();
        Assert.Equal(2, priority4.Length);
        // Earlier due date first among priority-4 items.
        Assert.True(priority4[0].DueDate <= priority4[1].DueDate);
    }

    // ── Find ────────────────────────────────────────────────────────────────

    [Fact]
    public void Find_returns_item_with_matching_id()
    {
        var service = CreateService();
        var created = service.Create(new CreateWorkItemRequest("Findable", null, 2, Today)).Value!;

        var found = service.Find(created.Id);

        Assert.NotNull(found);
        Assert.Equal(created.Id, found.Id);
    }

    [Fact]
    public void Find_returns_null_for_unknown_id()
    {
        var service = CreateService();

        var found = service.Find(Guid.NewGuid());

        Assert.Null(found);
    }

    // ── Summary health ──────────────────────────────────────────────────────

    [Fact]
    public void Summary_health_is_healthy_when_no_overdue_and_two_or_fewer_high_priority_open()
    {
        // Fresh service has no overdue items and exactly 2 high-priority open items (p5 + p4).
        var service = CreateService();

        var summary = service.GetSummary();

        Assert.Equal("Healthy", summary.Health);
    }

    [Fact]
    public void Summary_health_is_needs_attention_when_more_than_two_high_priority_open_items_exist()
    {
        // Seed already has p5 (InProgress) and p4 (Todo) — 2 high-priority open items.
        // Adding a third tips the threshold and changes health.
        var service = CreateService();
        service.Create(new CreateWorkItemRequest("Extra critical", null, 5, Today));

        var summary = service.GetSummary();

        Assert.Equal("Needs attention", summary.Health);
    }

    private static WorkItemService CreateService() => new(new FixedDateProvider(Today));
}
