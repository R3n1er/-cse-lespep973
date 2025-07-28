-- Fonction SQL pour les stats avancées du blog
CREATE OR REPLACE FUNCTION public.get_blog_stats()
RETURNS TABLE(
  total_posts integer,
  total_comments integer,
  total_reactions integer,
  total_views integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM blog_posts),
    (SELECT COUNT(*) FROM blog_comments),
    (SELECT COUNT(*) FROM blog_reactions),
    (SELECT COALESCE(SUM(view_count), 0) FROM blog_posts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 