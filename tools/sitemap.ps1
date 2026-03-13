# Generate sitemap.xml from all HTML files in the current directory tree
# Run from your site root: cd C:\Sites\exponanta.com && .\generate-sitemap.ps1

$baseUrl    = "https://cfeglobal.org"
$outputFile = ".\sitemap.xml"

# Pages to exclude from the sitemap
$excludePatterns = @(
    'styles-tags\.html$',
    'brandbook',
    'components',
    'assets',
    '404\.html$'
)

$urls = Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, '').Replace('\', '/').TrimStart('/')
    $lastmod      = $_.LastWriteTime.ToString("yyyy-MM-dd")

    # Skip excluded paths
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -match $pattern) { return }
    }

    # Build clean canonical URL
    if ($relativePath -match 'index\.html$') {
        $cleanUrl = "$baseUrl/" + ($relativePath -replace 'index\.html$', '')
    } else {
        $cleanUrl = "$baseUrl/" + ($relativePath -replace '\.html$', '')
    }

    # Remove double trailing slashes if any
    $cleanUrl = $cleanUrl -replace '//$', '/'

    "  <url>`n    <loc>$cleanUrl</loc>`n    <lastmod>$lastmod</lastmod>`n  </url>"
}

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($urls -join "`n")
</urlset>
"@

Set-Content -Path $outputFile -Value $sitemap -Encoding UTF8
Write-Host "Done: $($urls.Count) URLs written to $outputFile" -ForegroundColor Green