import os

# Define the paths
sitemap_path = r'C:\!DISK\116 WEBSITES AND DOMAINS\cfeglobal.org\sitemap.xml'
people_directory = r'C:\!DISK\116 WEBSITES AND DOMAINS\cfeglobal.org\people'

# Read the existing sitemap and store URLs
existing_urls = set()
with open(sitemap_path, 'r', encoding='utf-8') as file:
    sitemap_content = file.readlines()
    for line in sitemap_content:
        if '<loc>' in line:
            # Extract the URL from the <loc> tag
            existing_urls.add(line.strip().replace('<loc>', '').replace('</loc>', '').strip())

# Prepare to add new URLs
new_url_entries = []
for filename in os.listdir(people_directory):
    if os.path.isfile(os.path.join(people_directory, filename)):  # Ensure it's a file
        # Assuming the filename represents a URL, convert it to a proper URL format
        url = f"https://cfeglobal.org/people/{filename}"
        
        # Check if the URL is already in the existing sitemap
        if url not in existing_urls:
            # Create a new <url> entry
            new_url_entries.append("  <url>\n")
            new_url_entries.append(f"    <loc>{url}</loc>\n")
            new_url_entries.append(f"    <lastmod>2024-11-08</lastmod>\n")  # Customize this date as needed
            new_url_entries.append("  </url>\n")

# Find the position of the closing </urlset> tag
for i, line in enumerate(sitemap_content):
    if '</urlset>' in line:
        sitemap_content.insert(i, ''.join(new_url_entries))
        break

# Save the updated sitemap back to the file
with open(sitemap_path, 'w', encoding='utf-8') as file:
    file.writelines(sitemap_content)

print("Sitemap updated successfully with new URLs!")