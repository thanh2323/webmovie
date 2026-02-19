using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebMovie.Domain.Entities;

namespace WebMovie.Infrastructure.Data.Configurations;

public class WatchHistoryConfiguration : IEntityTypeConfiguration<WatchHistory>
{
    public void Configure(EntityTypeBuilder<WatchHistory> builder)
    {
        builder.ToTable("WatchHistory");

        builder.HasKey(w => w.Id);
        builder.Property(w => w.Id).ValueGeneratedOnAdd();

        builder.Property(w => w.MovieSlug).HasMaxLength(300).IsRequired();
        builder.Property(w => w.MovieName).HasMaxLength(500).IsRequired();
        builder.Property(w => w.MoviePosterUrl).HasMaxLength(500);
        builder.Property(w => w.MovieThumbUrl).HasMaxLength(500);

        builder.Property(w => w.EpisodeSlug).HasMaxLength(100).IsRequired();
        builder.Property(w => w.EpisodeName).HasMaxLength(200).IsRequired();

        builder.Property(w => w.WatchedAt).HasDefaultValueSql("NOW()");
        builder.Property(w => w.UpdatedAt).HasDefaultValueSql("NOW()");

        // Unique constraint: only one record per user per episode
        builder.HasIndex(w => new { w.UserId, w.MovieSlug, w.EpisodeSlug }).IsUnique();

        // Index to query watch history
        builder.HasIndex(w => new { w.UserId, w.WatchedAt });
    }
}
