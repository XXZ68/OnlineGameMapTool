using Microsoft.EntityFrameworkCore;

public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
{
}

public DbSet<Map> Map => Set<Map>();

public DbSet<Grid> Grids => Set<Grid>();

public DbSet<GridCell> GridCells => Set<GridCell>();

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // =========================
    // MapImage
    // =========================

    modelBuilder.Entity<Map>(entity =>
    {
        entity.ToTable("map");

        entity.HasKey(x => x.Id);

        entity.Property(x => x.FileName)
            .IsRequired();

        entity.Property(x => x.FilePath)
            .IsRequired();

        entity.Property(x => x.Width)
            .IsRequired();

        entity.Property(x => x.Height)
            .IsRequired();
    });

    // =========================
    // Grid
    // =========================

    modelBuilder.Entity<Grid>(entity =>
    {
        entity.ToTable("grids");

        entity.HasKey(x => x.Id);

        entity.HasOne(x => x.Map)
            .WithOne(x => x.Grid)
            .HasForeignKey<Grid>(x => x.MapId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.Property(x => x.Rows)
            .IsRequired();

        entity.Property(x => x.Columns)
            .IsRequired();
    });

    // =========================
    // GridCell
    // =========================

    modelBuilder.Entity<GridCell>(entity =>
    {
        entity.ToTable("grid_cells");

        entity.HasKey(x => x.Id);

        entity.HasOne(x => x.Grid)
            .WithMany(x => x.GridCell)
            .HasForeignKey(x => x.GridId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.Property(x => x.Coordinate)
            .IsRequired();

        // Eine Koordinate darf innerhalb
        // eines Rasters nur einmal existieren.
        entity.HasIndex(x => new
        {
            x.GridId,
            x.Coordinate
        })
        .IsUnique();
    });
}