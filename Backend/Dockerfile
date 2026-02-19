# Base stage for runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/WebMovie.Domain/WebMovie.Domain.csproj", "src/WebMovie.Domain/"]
COPY ["src/WebMovie.Application/WebMovie.Application.csproj", "src/WebMovie.Application/"]
COPY ["src/WebMovie.Infrastructure/WebMovie.Infrastructure.csproj", "src/WebMovie.Infrastructure/"]
COPY ["src/WebMovie.API/WebMovie.API.csproj", "src/WebMovie.API/"]

RUN dotnet restore "src/WebMovie.API/WebMovie.API.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/src/WebMovie.API"
RUN dotnet build "WebMovie.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "WebMovie.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebMovie.API.dll"]
