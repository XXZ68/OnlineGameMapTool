public class GridCellDto
{
    public string Coordinate { get; set; } = string.Empty;

    public int Row { get; set; }

    public int Column { get; set; }

    public double X { get; set; }
    public double Y { get; set; }

    public double Width { get; set; }
    public double Height { get; set; }

    public string? Content { get; set; }
}