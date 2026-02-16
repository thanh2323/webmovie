using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebMovie.Domain.Entities;

namespace WebMovie.Infrastructure.Data.Configurations;

public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
{
    public void Configure(EntityTypeBuilder<Favorite> builder)
    {
        builder.ToTable("Favorites");

        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id).ValueGeneratedOnAdd();

        builder.Property(f => f.MovieSlug).HasMaxLength(300).IsRequired();
        builder.Property(f => f.MovieName).HasMaxLength(500).IsRequired();
        builder.Property(f => f.MoviePosterUrl).HasMaxLength(500);
        builder.Property(f => f.MovieThumbUrl).HasMaxLength(500);

        builder.Property(f => f.CreatedAt).HasDefaultValueSql("NOW()");

        // Unique constraint: only one movie can be added to favorites once
        builder.HasIndex(f => new { f.UserId, f.MovieSlug }).IsUnique();
    }
}
