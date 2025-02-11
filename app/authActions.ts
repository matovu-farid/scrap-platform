"use server";

import { signIn, signOut, auth } from "./auth";

export async function login() {
  await signIn();
}

export async function logout() {
  await signOut();
}

export async function getSession() {
  const session = await auth();
  return session;
}

export async function isSignedIn() {
  const session = await getSession();

  return !!(session && session.user);
}
