using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace AgenticWorkflows.Api.Tests;

public sealed class WorkItemApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Get_notifications_returns_not_found_for_unknown_work_item()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync($"/work-items/{Guid.NewGuid()}/notifications");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
