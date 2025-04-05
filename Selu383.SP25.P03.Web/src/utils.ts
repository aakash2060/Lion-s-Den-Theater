/**
 * Creates a URL-friendly version of a movie title
 */
export function createMovieUrl(title: string, id: number): string {
    // Convert title to lowercase, replace spaces with hyphens, remove special characters
    const cleanTitle = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    // Format: /movie/movie-title-123
    return `/movie/${cleanTitle}-${id}`;
  }
  
  /**
   * Gets the movie ID from a URL path
   */
  export function getMovieIdFromUrl(path: string): number | null {
    // Extract the ID from the end of the URL
    const idMatch = path.match(/-(\d+)$/);
    return idMatch ? parseInt(idMatch[1]) : null;
  }