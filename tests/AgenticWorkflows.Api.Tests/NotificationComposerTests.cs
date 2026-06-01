using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class NotificationComposerTests
{
    [Fact]
    public void BuildCreatedNotification_truncates_description_longer_than_90_chars()
    {
        var item = CreateItem(description: new string('x', 100));

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains($"Description: {new string('x', 87)}...", notification);
    }

    [Fact]
    public void BuildCreatedNotification_does_not_truncate_description_of_90_chars()
    {
        var description = new string('x', 90);
        var item = CreateItem(description: description);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains($"Description: {description}", notification);
        Assert.DoesNotContain("...", notification);
    }

    [Theory]
    [InlineData(5, "Critical")]
    [InlineData(4, "High")]
    [InlineData(3, "Medium")]
    [InlineData(2, "Low")]
    [InlineData(1, "Backlog")]
    [InlineData(0, "Backlog")]
    public void BuildCreatedNotification_formats_priority_label(int priority, string expectedLabel)
    {
        var item = CreateItem(priority: priority);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains($"Priority: {expectedLabel}", notification);
    }

    [Fact]
    public void BuildCreatedNotification_omits_description_line_when_null()
    {
        var item = CreateItem(description: null);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.DoesNotContain("Description:", notification);
    }

    [Fact]
    public void BuildCreatedNotification_omits_due_date_line_when_null()
    {
        var item = CreateItem(dueDate: null);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.DoesNotContain("Due date:", notification);
    }

    private static WorkItem CreateItem(
        string? description = null,
        int priority = 3,
        DateOnly? dueDate = null) =>
        new(
            Guid.NewGuid(),
            "Title",
            description,
            priority,
            WorkItemStatus.Todo,
            dueDate);
}
