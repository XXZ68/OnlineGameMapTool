public class GridCell
{
    public int Id { get; set; }

    public int GridId { get; set; }

    public Grid Grid { get; set; } = null!;

    public int Row { get; set; }

    public int Column { get; set; }

    public string Coordinate { get; set; } = string.Empty;

    public string? Content { get; set; }
}