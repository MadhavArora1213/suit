import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

const resolveName = (authUser, data = {}) => {
  const stored = clean(data.name);
  if (stored) return stored;
  const authName = clean(authUser?.displayName);
  if (authName) return authName;
  const email = clean(data.email) || clean(authUser?.email);
  if (email) return email.split('@')[0];
  return 'Gurnaaz Member';
};

/**
 * Merges a Firestore profile with the Firebase Auth session so identity
 * fields are never empty, even when the Firestore doc is partial
 * (e.g. created only by cart/favorites writes) or missing entirely.
 */
export function buildProfile(authUser, data = {}) {
  return {
    ...data,
    uid: authUser?.uid || data.uid || '',
    name: resolveName(authUser, data),
    email: clean(data.email) || clean(authUser?.email),
    phone: clean(data.phone) || clean(authUser?.phoneNumber),
    role: data.role || 'customer',
  };
}

/**
 * True when the stored profile is missing core identity fields and should
 * be repaired (or created) in Firestore.
 */
export function profileNeedsHeal(exists, data = {}) {
  return !exists
    || !clean(data.name)
    || !clean(data.email)
    || !data.role
    || !data.uid;
}

/**
 * Repairs the Firestore profile doc inside a transaction so a partial doc
 * (or a missing one) always ends up with uid/name/email/role/createdAt.
 * Re-reads inside the transaction, so it never overwrites a fuller profile
 * written concurrently (e.g. right after signup).
 */
export async function healUserDoc(authUser) {
  if (!authUser?.uid || !isFirebaseConfigured() || !db) return;
  const ref = doc(db, 'users', authUser.uid);
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists() ? snap.data() : {};
      const profile = buildProfile(authUser, data);
      const patch = {};
      if (!clean(data.uid)) patch.uid = profile.uid;
      if (!clean(data.name)) patch.name = profile.name;
      if (!clean(data.email) && profile.email) patch.email = profile.email;
      if (!clean(data.phone) && profile.phone) patch.phone = profile.phone;
      if (!data.role) patch.role = profile.role;
      if (!data.createdAt) patch.createdAt = serverTimestamp();
      if (Object.keys(patch).length === 0) return;
      patch.updatedAt = serverTimestamp();
      tx.set(ref, patch, { merge: true });
    });
  } catch (err) {
    console.warn('Profile sync skipped:', err?.message || err);
  }
}
