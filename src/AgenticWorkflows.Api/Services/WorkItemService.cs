using AgenticWorkflows.Api.Models;

namespace AgenticWorkflows.Api.Services;

public sealed class WorkItemService
{
    private readonly IDateProvider _dateProvider;
    private readonly List<WorkItem> _items;

    public WorkItemService(IDateProvider dateProvider)
    {
        _dateProvider = dateProvider;
        _items = SeedWorkItems(dateProvider.Today);
    }

    public IReadOnlyCollection<WorkItem> GetAll() =>
        _items
            .OrderByDescending(item => item.Priority)
            .ThenBy(item => item.DueDate ?? DateOnly.MaxValue)
            .ToArray();

    public WorkItem? Find(Guid id) => _items.SingleOrDefault(item => item.Id == id);

    public OperationResult<WorkItem> Create(CreateWorkItemRequest request)
    {
        var errors = Validate(request);

        if (errors.Count > 0)
        {
            return OperationResult<WorkItem>.Failure(errors);
        }

        var item = new WorkItem(
            Guid.NewGuid(),
            request.Title.Trim(),
            string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            request.Priority,
            WorkItemStatus.Todo,
            request.DueDate);

        _items.Add(item);

        return OperationResult<WorkItem>.Success(item);
    }

    public WorkItemSummary GetSummary()
    {
        var openItems = _items.Where(item => item.Status != WorkItemStatus.Done).ToArray();
        var overdue = openItems.Count(item => item.DueDate < _dateProvider.Today);
        var highPriorityOpen = openItems.Count(item => item.Priority >= 4);

        var health = overdue == 0 && highPriorityOpen <= 2
            ? "Healthy"
            : "Needs attention";

        return new WorkItemSummary(
            _items.Count,
            openItems.Length,
            _items.Count(item => item.Status == WorkItemStatus.Done),
            overdue,
            highPriorityOpen,
            health);
    }

    private IReadOnlyCollection<ValidationError> Validate(CreateWorkItemRequest request)
    {
        var errors = new List<ValidationError>();

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            errors.Add(new ValidationError(nameof(request.Title), "Title is required."));
        }
        else if (request.Title.Trim().Length > 80)
        {
            errors.Add(new ValidationError(nameof(request.Title), "Title must be 80 characters or fewer."));
        }

        if (request.Description?.Trim().Length > 240)
        {
            errors.Add(new ValidationError(nameof(request.Description), "Description must be 240 characters or fewer."));
        }

        if (request.Priority is < 1 or > 5)
        {
            errors.Add(new ValidationError(nameof(request.Priority), "Priority must be between 1 and 5."));
        }

        if (request.DueDate < _dateProvider.Today)
        {
            errors.Add(new ValidationError(nameof(request.DueDate), "Due date cannot be in the past."));
        }

        return errors;
    }

    private static List<WorkItem> SeedWorkItems(DateOnly today) =>
    [
        new WorkItem(
            Guid.Parse("5b5c5109-1b95-42f4-88cc-4698eaf2e571"),
            "Show documentation drift",
            "Change an endpoint and let the documentation workflow find what needs updating.",
            4,
            WorkItemStatus.InProgress,
            today.AddDays(2)),
        new WorkItem(
            Guid.Parse("c9383ae4-3390-4214-9685-d6a90b13f01b"),
            "Review test quality",
            "Compare meaningful behavior tests with low-value implementation tests.",
            5,
            WorkItemStatus.Todo,
            today.AddDays(1)),
        new WorkItem(
            Guid.Parse("07f9e0cd-8f0f-47f7-8ec0-3938677f599d"),
            "Refactor duplicate notifications",
            "Use the duplicate-code detector to identify repeated notification formatting.",
            3,
            WorkItemStatus.Todo,
            today.AddDays(5)),
        new WorkItem(
            Guid.Parse("11d8dc9c-f6b2-4f00-9893-e4451ac15bec"),
            "Prepare demo script",
            "Keep the talk track short and focused on workflow outcomes.",
            2,
            WorkItemStatus.Done,
            today.AddDays(-1))
    ];
}
