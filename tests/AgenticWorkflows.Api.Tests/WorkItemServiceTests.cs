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

    [Theory]
    [InlineData(80, true)]
    [InlineData(81, false)]
    public void Create_validates_title_length_boundary(int length, bool expectSuccess)
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest(new string('x', length), null, 3, Today);

        var result = service.Create(request);

        Assert.Equal(expectSuccess, result.Succeeded);
        if (!expectSuccess)
        {
            var error = Assert.Single(result.Errors);
            Assert.Equal(nameof(CreateWorkItemRequest.Title), error.Code);
            Assert.Contains("80", error.Message);
        }
    }

    [Theory]
    [InlineData(240, true)]
    [InlineData(241, false)]
    public void Create_validates_description_length_boundary(int length, bool expectSuccess)
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Valid", new string('x', length), 3, Today);

        var result = service.Create(request);

        Assert.Equal(expectSuccess, result.Succeeded);
        if (!expectSuccess)
        {
            Assert.Single(result.Errors, error => error.Code == nameof(CreateWorkItemRequest.Description));
        }
    }

    [Theory]
    [InlineData(0, false)]
    [InlineData(1, true)]
    [InlineData(5, true)]
    [InlineData(6, false)]
    public void Create_validates_priority_boundaries(int priority, bool expectSuccess)
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Valid", null, priority, Today);

        var result = service.Create(request);

        Assert.Equal(expectSuccess, result.Succeeded);
        if (!expectSuccess)
        {
            Assert.Single(result.Errors, error => error.Code == nameof(CreateWorkItemRequest.Priority));
        }
    }

    [Fact]
    public void Create_accepts_due_date_of_today()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Valid", null, 3, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Create_accepts_null_due_date()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Valid", null, 3, null);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Value);
        Assert.Null(result.Value.DueDate);
    }

    [Fact]
    public void Create_stores_whitespace_description_as_null()
    {
        var service = CreateService();
        var request = new CreateWorkItemRequest("Valid", "   ", 3, Today);

        var result = service.Create(request);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Value);
        Assert.Null(result.Value.Description);
    }

    [Fact]
    public void Find_returns_null_for_unknown_id()
    {
        var service = CreateService();

        var item = service.Find(Guid.NewGuid());

        Assert.Null(item);
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
    public void Summary_health_is_healthy_when_no_overdue_and_at_most_two_high_priority()
    {
        var service = CreateService();

        var summary = service.GetSummary();

        Assert.Equal(0, summary.Overdue);
        Assert.Equal(2, summary.HighPriorityOpen);
        Assert.Equal("Healthy", summary.Health);
    }

    [Fact]
    public void Summary_health_needs_attention_when_overdue_items_exist()
    {
        var dateProvider = new MutableDateProvider(Today);
        var service = new WorkItemService(dateProvider);
        dateProvider.Today = Today.AddDays(3);

        var summary = service.GetSummary();

        Assert.True(summary.Overdue > 0);
        Assert.Equal("Needs attention", summary.Health);
    }

    [Fact]
    public void GetAll_orders_by_priority_descending_then_due_date_ascending()
    {
        var service = CreateService();
        service.Create(new CreateWorkItemRequest("Later critical item", null, 5, Today.AddDays(10)));
        service.Create(new CreateWorkItemRequest("Earlier critical item", null, 5, Today.AddDays(2)));

        var items = service.GetAll().ToArray();

        Assert.All(items.Zip(items.Skip(1)), pair =>
        {
            var (current, next) = pair;
            Assert.True(
                current.Priority > next.Priority
                || current.Priority == next.Priority && (current.DueDate ?? DateOnly.MaxValue) <= (next.DueDate ?? DateOnly.MaxValue));
        });
        Assert.Equal(5, items[0].Priority);
        Assert.Equal(Today.AddDays(1), items[0].DueDate);
    }

    private static WorkItemService CreateService() => new(new FixedDateProvider(Today));

    private sealed class MutableDateProvider(DateOnly today) : IDateProvider
    {
        public DateOnly Today { get; set; } = today;
    }
}
