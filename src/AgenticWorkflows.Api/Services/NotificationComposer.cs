using System.Globalization;
using AgenticWorkflows.Api.Models;

namespace AgenticWorkflows.Api.Services;

public static class NotificationComposer
{
    public static string BuildCreatedNotification(WorkItem item)
    {
        var lines = new List<string>
        {
            "Agentic Workflows Demo",
            "Notification: Work item created",
            $"Item: {NormalizeTitle(item.Title)}",
            $"Priority: {FormatPriority(item.Priority)}"
        };

        if (!string.IsNullOrWhiteSpace(item.Description))
        {
            var description = item.Description.Trim();
            if (description.Length > 90)
            {
                description = description[..87] + "...";
            }

            lines.Add($"Description: {description}");
        }

        if (item.DueDate is not null)
        {
            lines.Add($"Due date: {item.DueDate.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}");
        }

        lines.Add($"Status: {item.Status}");
        lines.Add("Next step: Review the backlog and assign an owner.");

        return string.Join(Environment.NewLine, lines);
    }

    public static string BuildDueSoonNotification(WorkItem item)
    {
        var lines = new List<string>
        {
            "Agentic Workflows Demo",
            "Notification: Work item due soon",
            $"Item: {NormalizeTitle(item.Title)}",
            $"Priority: {FormatPriority(item.Priority)}"
        };

        if (!string.IsNullOrWhiteSpace(item.Description))
        {
            var description = item.Description.Trim();
            if (description.Length > 90)
            {
                description = description[..87] + "...";
            }

            lines.Add($"Description: {description}");
        }

        if (item.DueDate is not null)
        {
            lines.Add($"Due date: {item.DueDate.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}");
        }

        lines.Add($"Status: {item.Status}");
        lines.Add("Next step: Confirm the item still belongs in this sprint.");

        return string.Join(Environment.NewLine, lines);
    }

    private static string FormatPriority(int priority) => priority switch
    {
        5 => "Critical",
        4 => "High",
        3 => "Medium",
        2 => "Low",
        _ => "Backlog"
    };

    private static string NormalizeTitle(string title) => title.Trim();
}
