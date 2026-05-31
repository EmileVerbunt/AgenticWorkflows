using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class NotificationComposerTests
{
    private static readonly DateOnly SomeDueDate = new(2026, 6, 15);

    // ── BuildCreatedNotification ────────────────────────────────────────────

    [Fact]
    public void BuildCreatedNotification_contains_required_header_lines()
    {
        var item = MakeItem("Deploy hotfix", priority: 5, status: WorkItemStatus.Todo);

        var notification = NotificationComposer.BuildCreatedNotification(item);
        var lines = Lines(notification);

        Assert.Equal("Agentic Workflows Demo", lines[0]);
        Assert.Equal("Notification: Work item created", lines[1]);
        Assert.Contains("Item: Deploy hotfix", lines);
        Assert.Contains("Priority: Critical", lines);
        Assert.Contains("Status: Todo", lines);
        Assert.Contains("Next step: Review the backlog and assign an owner.", lines);
    }

    [Fact]
    public void BuildCreatedNotification_includes_description_when_present()
    {
        var item = MakeItem("Fix regression", description: "Breaks login flow.", priority: 3, status: WorkItemStatus.InProgress);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Description: Breaks login flow.", notification);
    }

    [Fact]
    public void BuildCreatedNotification_omits_description_line_when_null()
    {
        var item = MakeItem("Simple task", description: null, priority: 2, status: WorkItemStatus.Todo);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.DoesNotContain("Description:", notification);
    }

    [Fact]
    public void BuildCreatedNotification_truncates_description_longer_than_90_chars()
    {
        var longDescription = new string('x', 100); // 100 chars
        var item = MakeItem("Long desc", description: longDescription, priority: 1, status: WorkItemStatus.Todo);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        var descLine = Lines(notification).Single(l => l.StartsWith("Description:"));
        // Truncated to 87 chars + "..."
        Assert.EndsWith("...", descLine);
        Assert.Equal("Description: " + new string('x', 87) + "...", descLine);
    }

    [Fact]
    public void BuildCreatedNotification_does_not_truncate_description_of_exactly_90_chars()
    {
        var description = new string('y', 90);
        var item = MakeItem("Boundary", description: description, priority: 1, status: WorkItemStatus.Todo);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        var descLine = Lines(notification).Single(l => l.StartsWith("Description:"));
        Assert.EndsWith(new string('y', 90), descLine);
        Assert.DoesNotContain("...", descLine);
    }

    [Fact]
    public void BuildCreatedNotification_includes_formatted_due_date()
    {
        var item = MakeItem("Release", priority: 4, status: WorkItemStatus.Todo, dueDate: SomeDueDate);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains("Due date: 2026-06-15", notification);
    }

    [Fact]
    public void BuildCreatedNotification_omits_due_date_line_when_null()
    {
        var item = MakeItem("No deadline", priority: 2, status: WorkItemStatus.Todo, dueDate: null);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.DoesNotContain("Due date:", notification);
    }

    [Theory]
    [InlineData(5, "Critical")]
    [InlineData(4, "High")]
    [InlineData(3, "Medium")]
    [InlineData(2, "Low")]
    [InlineData(1, "Backlog")]
    public void BuildCreatedNotification_formats_priority_labels_correctly(int priority, string expected)
    {
        var item = MakeItem("Task", priority: priority, status: WorkItemStatus.Todo);

        var notification = NotificationComposer.BuildCreatedNotification(item);

        Assert.Contains($"Priority: {expected}", notification);
    }

    // ── BuildDueSoonNotification ────────────────────────────────────────────

    [Fact]
    public void BuildDueSoonNotification_contains_required_header_and_next_step()
    {
        var item = MakeItem("Upcoming task", priority: 3, status: WorkItemStatus.InProgress, dueDate: SomeDueDate);

        var notification = NotificationComposer.BuildDueSoonNotification(item);
        var lines = Lines(notification);

        Assert.Equal("Agentic Workflows Demo", lines[0]);
        Assert.Equal("Notification: Work item due soon", lines[1]);
        Assert.Contains("Next step: Confirm the item still belongs in this sprint.", lines);
    }

    [Fact]
    public void BuildDueSoonNotification_truncates_description_longer_than_90_chars()
    {
        var longDescription = new string('z', 95);
        var item = MakeItem("Task", description: longDescription, priority: 2, status: WorkItemStatus.InProgress);

        var notification = NotificationComposer.BuildDueSoonNotification(item);

        var descLine = Lines(notification).Single(l => l.StartsWith("Description:"));
        Assert.EndsWith("...", descLine);
        Assert.Equal("Description: " + new string('z', 87) + "...", descLine);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private static WorkItem MakeItem(
        string title,
        string? description = null,
        int priority = 3,
        WorkItemStatus status = WorkItemStatus.Todo,
        DateOnly? dueDate = null) =>
        new(Guid.NewGuid(), title, description, priority, status, dueDate);

    private static string[] Lines(string text) =>
        text.Split(Environment.NewLine);
}
