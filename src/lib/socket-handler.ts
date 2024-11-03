import { io, Socket } from 'socket.io-client';
import * as AuthAPI from '$api/auth-api';
import { socket as socketStore } from '$stores/socket-store';
import { PUBLIC_BASE_GATEWAY } from '$env/static/public';
import { get } from 'svelte/store';

export async function connectSocket() {
	const response = await AuthAPI.getGatewayToken();

	if (!response || !response.ok) {
		console.error('Unable to obtain gateway token');
		return;
	}

	const data = response.data;
	const { auth_token: authToken } = data;

	const socket = io(PUBLIC_BASE_GATEWAY, {
		reconnection: false,
		transports: ['websocket'],
		query: {
			authorization: `Bearer ${authToken}`
		},
		withCredentials: true
	});

	socket.on('connect_error', async () => {
		setTimeout(async () => await reconnectSocket(socket), 5000);
	});

	socket.on('disconnect', () => {
		reconnectSocket(socket);
	});

	socketStore.set(socket);
}

export async function disconnectSocket() {
	const socket = get(socketStore);
	if (!socket) {
		return;
	}
	socket.disconnect();
}

export async function reconnectSocket(socket: Socket) {
	console.warn('Reconnecting to websocket server');

	const response = await AuthAPI.getGatewayToken();

	if (!response || !response.ok) {
		console.error('Unable to obtain gateway token');
		setTimeout(async () => await reconnectSocket(socket), 5000);
		return;
	}

	const data = response.data;
	const { auth_token: authToken } = data;

	socket.io.opts.query = {
		authorization: `Bearer ${authToken}`
	};

	socket.connect();
}
