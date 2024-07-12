import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { get } from "svelte/store";

export const redirect = async (origins: RegExp[], target: string) => {
  const $page = get(page);
  const path = $page.url.pathname;
  if (!path) {
    return;
  }

  for (const origin of origins) {
    const valid = origin.test(path);

    if (valid) {
      return await goto(target, {
        invalidateAll: true
      });
    }
  }
}

export const getTextInitials = (name: string) => {
	if (!name) {
		return '';
	}

	return name.split(' ').slice(0, 2).map((name) => name[0].toUpperCase()).join('');
};

export const textToColor = (text: string) => {
	if (!text) {
		text = '';
	}

	const chars = text.split('');
	let count = 0;
	chars.forEach((char) => count += char.charCodeAt(0));

	const colors = [
		'bg-red-500',
		'bg-orange-500',
		'bg-yellow-500',
		'bg-green-500',
		'bg-blue-500',
		'bg-pink-500',
		'bg-purple-500',
	];

	return colors[(count % colors.length)];
};