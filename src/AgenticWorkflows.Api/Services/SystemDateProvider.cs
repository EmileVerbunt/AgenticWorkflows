namespace AgenticWorkflows.Api.Services;

public sealed class SystemDateProvider : IDateProvider
{
    public DateOnly Today => DateOnly.FromDateTime(DateTime.UtcNow);
}
