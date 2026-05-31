using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class NotificationComposerTests
{
    private static readonly DateOnly SomeDate = new(2026, 6, 15);

    // ── BuildCreatedNotification ──────────────────────────────────────────────

    [Fact]
    public void Created_notification_contains_formatted_header_and_next_step()
    {
        var item = new WorkItem(Guid.NewGuid(), "Fix login bug", null, 3, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Notification: Work item created", text);
        Assert.Contains("Next step: Review the backlog and assign an owner.", text);
    }

    [Theory]
    [InlineData(5, "Critical")]
    [InlineData(4, "High")]
    [InlineData(3, "Medium")]
    [InlineData(2, "Low")]
    [InlineData(1, "Backlog")]
    public void Created_notification_formats_priority_label_correctly(int priority, string expected)
    {
        var item = new WorkItem(Guid.NewGuid(), "Some task", null, priority, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains($"Priority: {expected}", text);
    }

    [Fact]
    public void Created_notification_formats_due_date_as_iso8601()
    {
        var item = new WorkItem(Guid.NewGuid(), "Release prep", null, 3, WorkItemStatus.Todo, SomeDate);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Due date: 2026-06-15", text);
    }

    [Fact]
    public void Created_notification_omits_due_date_line_when_null()
    {
        var item = new WorkItem(Guid.NewGuid(), "No deadline", null, 2, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.DoesNotContain("Due date:", text);
    }

    [Fact]
    public void Created_notification_includes_description_when_provided()
    {
        var item = new WorkItem(Guid.NewGuid(), "Fix bug", "Steps to reproduce.", 3, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Description: Steps to reproduce.", text);
    }

    [Fact]
    public void Created_notification_omits_description_line_when_null()
    {
        var item = new WorkItem(Guid.NewGuid(), "Fix bug", null, 3, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.DoesNotContain("Description:", text);
    }

    [Fact]
    public void Created_notification_truncates_description_longer_than_90_characters()
    {
        var longDescription = new string('x', 91);
        var item = new WorkItem(Guid.NewGuid(), "Title", longDescription, 3, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Description: " + new string('x', 87) + "...", text);
    }

    [Fact]
    public void Created_notification_does_not_truncate_description_at_exactly_90_characters()
    {
        var description = new string('x', 90);
        var item = new WorkItem(Guid.NewGuid(), "Title", description, 3, WorkItemStatus.Todo, null);

        var text = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Description: " + description, text);
        Assert.DoesNotContain("...", text);
    }

    // ── BuildDueSoonNotification ──────────────────────────────────────────────

    [Fact]
    public void DueSoon_notification_contains_formatted_header_and_next_step()
    {
        var item = new WorkItem(Guid.NewGuid(), "Expiring task", null, 4, WorkItemStatus.InProgress, SomeDate);

        var text = NotificationComposer.BuildDueSoonNotification(item);

        Assert.Contains("Notification: Work item due soon", text);
        Assert.Contains("Next step: Confirm the item still belongs in this sprint.", text);
    }

    [Fact]
    public void DueSoon_notification_truncates_long_description()
    {
        var longDescription = new string('y', 95);
        var item = new WorkItem(Guid.NewGuid(), "Sprint task", longDescription, 3, WorkItemStatus.InProgress, SomeDate);

        var text = NotificationComposer.BuildDueSoonNotification(item);

        Assert.Contains("Description: " + new string('y', 87) + "...", text);
    }
}
