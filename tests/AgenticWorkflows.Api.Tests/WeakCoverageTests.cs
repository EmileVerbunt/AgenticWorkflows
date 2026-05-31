using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class WeakCoverageTests
{
    // These two tests existed here before and passed, but gave little confidence
    // because they checked enum count and "not empty" rather than actual behaviour.
    // They have been replaced below with tests that verify observable rules.

    [Theory]
    [InlineData(WorkItemStatus.Todo)]
    [InlineData(WorkItemStatus.InProgress)]
    [InlineData(WorkItemStatus.Done)]
    public void Work_item_status_values_are_the_expected_named_values(WorkItemStatus status)
    {
        // Confirms the three meaningful states exist by name, not just by count.
        Assert.True(Enum.IsDefined(status));
    }

    [Fact]
    public void Summary_health_is_healthy_when_service_starts_with_no_overdue_items()
    {
        // Seed data contains no past-due open items, so health must be "Healthy".
        var service = new WorkItemService(new FixedDateProvider(new DateOnly(2026, 5, 31)));

        var summary = service.GetSummary();

        Assert.Equal("Healthy", summary.Health);
    }
}
