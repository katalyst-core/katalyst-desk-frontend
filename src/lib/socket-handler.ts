import { io, Socket } from 'socket.io-client';
import * as AuthAPI from '$api/auth-api';
import { socket as socketStore, isSockedConnected } from '$stores/socket-store';
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

	socket.on('connect', () => {
		isSockedConnected.set(true);
	});

	socket.on('connect_error', () => {
		reconnectSocket(socket)
	});

	socket.on('disconnect', () => {
		reconnectSocket(socket)
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
	isSockedConnected.set(false);

	try {
		console.warn('Reconnecting to websocket server');

		const response = await AuthAPI.getGatewayToken();

		if (!response.ok) throw new Error();

		console.log('socket connected again');

		const data = response.data;
		const { auth_token: authToken } = data;

		socket.io.opts.query = {
			authorization: `Bearer ${authToken}`
		};

		socket.connect();
	} catch {
		console.error('Unable to obtain gateway token');
		setTimeout(() => reconnectSocket(socket), 10000);
	}
}
