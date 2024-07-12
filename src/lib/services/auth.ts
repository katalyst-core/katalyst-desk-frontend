import { fetchApi } from "$lib/custom-fetch";
import { user } from "$stores/user";

import { redirect } from '$utils/index';

export const fetchUser = async () => {
  const response = await fetchApi('/user/info')

  if (!response.ok) {
    user.set(null);

    // Redirect to sign-in if user is not logged in while in the app
    await redirect([/^\/app\/.*$/], '/auth/sign-in');

    return;
  }

  // Redirect to dashboard if user is logged in
  await redirect([/^\/auth\/sign-in$/, /^\/auth\/sign-up/, /^\/$/], '/app/dashboard');

  const result = await response.json();
  user.set(result.data);
};