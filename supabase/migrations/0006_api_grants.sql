-- NeuralForge Layer 0: Data API grants
-- RLS decides which rows are visible; these grants decide which roles can reach
-- the tables/functions through Supabase's generated API.

grant usage on schema public to anon, authenticated;

grant select on table sources to anon, authenticated;
grant select on table clusters to anon, authenticated;
grant select on table summary_cache to anon, authenticated;

grant insert on table waitlist to anon, authenticated;

grant select, insert, update on table user_profiles to authenticated;
grant select, insert, update on table user_reads to authenticated;
grant select on table digest_sends to authenticated;

grant execute on function get_feed(uuid, text[], text, int, int, int, timestamptz) to authenticated;
grant execute on function update_user_streak(uuid) to authenticated;
