public class Grid
{
    public int Id { get; set; }

    public int MapId { get; set; }

    public Map Map { get; set; } = null!;

    public int Rows { get; set; }

    public int Columns { get; set; }

    // Position des Rasters auf dem Bild
    public double OffsetX { get; set; }

    public double OffsetY { get; set; }

    // Größe des Rasters
    public double Width { get; set; }

    public double Height { get; set; }
}