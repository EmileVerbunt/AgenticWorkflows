using AgenticWorkflows.Api.Services;

namespace AgenticWorkflows.Api.Tests;

public sealed class FixedDateProvider(DateOnly today) : IDateProvider
{
    public DateOnly Today { get; } = today;
}
