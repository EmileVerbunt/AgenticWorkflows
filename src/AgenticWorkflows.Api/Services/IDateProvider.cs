namespace AgenticWorkflows.Api.Services;

public interface IDateProvider
{
    DateOnly Today { get; }
}
