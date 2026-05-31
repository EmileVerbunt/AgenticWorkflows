using AgenticWorkflows.Api.Models;

namespace AgenticWorkflows.Api.Services;

public sealed record OperationResult<T>(T? Value, IReadOnlyCollection<ValidationError> Errors)
{
    public bool Succeeded => Errors.Count == 0;

    public static OperationResult<T> Success(T value) => new(value, Array.Empty<ValidationError>());

    public static OperationResult<T> Failure(IReadOnlyCollection<ValidationError> errors) => new(default, errors);
}
