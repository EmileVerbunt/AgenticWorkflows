using AgenticWorkflows.Api.Models;
using AgenticWorkflows.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<IDateProvider, SystemDateProvider>();
builder.Services.AddSingleton<WorkItemService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => Results.Redirect("/work-items"))
    .WithName("Home");

var workItems = app.MapGroup("/work-items")
    .WithTags("Work items");

workItems.MapGet("", (WorkItemService service) => Results.Ok(service.GetAll()))
    .WithName("ListWorkItems");

workItems.MapPost("", (CreateWorkItemRequest request, WorkItemService service) =>
    {
        var result = service.Create(request);

        if (!result.Succeeded)
        {
            return Results.ValidationProblem(result.Errors.ToDictionary(
                error => error.Code,
                error => new[] { error.Message }));
        }

        return Results.Created($"/work-items/{result.Value!.Id}", result.Value);
    })
    .WithName("CreateWorkItem");

workItems.MapGet("/summary", (WorkItemService service) => Results.Ok(service.GetSummary()))
    .WithName("GetWorkItemSummary");

workItems.MapGet("/{id:guid}/notifications", (Guid id, WorkItemService service) =>
    {
        var item = service.Find(id);

        if (item is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(new
        {
            Created = NotificationComposer.BuildCreatedNotification(item),
            DueSoon = NotificationComposer.BuildDueSoonNotification(item)
        });
    })
    .WithName("GetWorkItemNotifications");

app.Run();
