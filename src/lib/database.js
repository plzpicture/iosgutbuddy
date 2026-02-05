import { supabase } from './supabase';

// ── Profile ──────────────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}

// ── Daily Records ────────────────────────────────────────
export async function getDailyRecords(userId) {
  const { data, error } = await supabase
    .from('daily_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function upsertDailyRecord(userId, record) {
  const { error } = await supabase
    .from('daily_records')
    .upsert(
      { user_id: userId, ...record },
      { onConflict: 'user_id,date' }
    );
  if (error) throw error;
}

// ── Exercise Records ─────────────────────────────────────
export async function getExerciseRecords(userId) {
  const { data, error } = await supabase
    .from('exercise_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function upsertExerciseRecord(userId, record) {
  const { error } = await supabase
    .from('exercise_records')
    .upsert(
      { user_id: userId, ...record },
      { onConflict: 'user_id,date' }
    );
  if (error) throw error;
}

// ── Chat Messages ────────────────────────────────────────
export async function getChatMessages(userId, limit = 50) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function saveChatMessage(userId, role, content) {
  const { error } = await supabase
    .from('chat_messages')
    .insert({ user_id: userId, role, content });
  if (error) throw error;
}

// ── Photos ───────────────────────────────────────────────
export async function uploadPhoto(userId, uri, mealType) {
  const fileName = `${userId}/${Date.now()}.jpg`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, blob, { contentType: 'image/jpeg' });
  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase
    .from('photos')
    .insert({ user_id: userId, storage_path: fileName, meal_type: mealType });
  if (dbError) throw dbError;

  return fileName;
}

export async function getPhotoUrl(path) {
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data?.publicUrl || '';
}

export async function deletePhoto(userId, photoId, storagePath) {
  await supabase.storage.from('photos').remove([storagePath]);
  await supabase.from('photos').delete().eq('id', photoId).eq('user_id', userId);
}
