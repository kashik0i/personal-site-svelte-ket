import { Message, type User } from './model';
import io from 'socket.io-client';
import { pushMessage } from './store';
interface CreateGuestUserResponse {
	ok: boolean;
	username: string;
	room: string;
}

export class Server {
	socket: SocketIOClient.Socket;
	constructor() {
		this.socket = io.connect('http://localhost:3030');
		this.socket.on('error', function (evData: string) {
			console.error('Connection Error:', evData);
		});

		this.socket.on('connected', (payload: { ok: boolean; id: string }) => {
			console.log(payload, this.socket.id);
			this.socket.on('private message', (senderId: string, msg: Message) => {
				console.log(senderId, msg);
			});
			this.socket.on('message', (room: string, senderId: string, message: Message) => {
				console.log(
					`message sent in room ${room} by ${message.from} with id ${senderId}: ${message.content}`
				);
				pushMessage(message);
			});
		});
	}
	createGuestUser(username: string): Promise<CreateGuestUserResponse> {
		console.log('handling guest creation');
		return new Promise((resolve, reject) => {
			this.socket.emit('createGuestUser', username, (res: CreateGuestUserResponse) => {
				if (res.ok) {
					// eslint-disable-next-line no-debugger
					// debugger;
					// this.socket.emit(res.room, this.socket.id, new Message(username, 'hi'));

					resolve(res);
				} else {
					reject("don't know yet");
				}
			});
		});
	}

	pushMessage(msg: Message, to: string): Promise<{ ok: boolean }> {
		return new Promise((resolve, reject) => {
			this.socket.emit('message', to, msg, (res: { ok: boolean }) => {
				// console.log('message sent', msg, res);
				resolve(res);
			});
		});
	}
}

export type ServerInterface = typeof Server;
