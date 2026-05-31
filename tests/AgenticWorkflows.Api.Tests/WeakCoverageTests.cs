using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class WeakCoverageTests
{
    [Fact]
    public void Work_item_status_has_three_values()
    {
        Assert.Equal(3, Enum.GetValues<WorkItemStatus>().Length);
    }

    [Fact]
    public void Summary_health_is_not_empty()
    {
        var service = new WorkItemService(new FixedDateProvider(new DateOnly(2026, 5, 31)));

        var summary = service.GetSummary();

        Assert.False(string.IsNullOrWhiteSpace(summary.Health));
    }
}
