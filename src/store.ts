import type { User, Message } from 'model';
import { writable } from 'svelte/store';

export const messages = writable<Array<Message>>([]);
export const user = writable<User>();
export const roomUsers = writable<Array<User>>();

export const pushMessage = (message: Message) => {
	messages.update((msgs) => [...msgs, message]);
};
export const pushRoomUser = (user: User) => {
	roomUsers.update((users) => [...users, user]);
};
export const setRoomUsers = (users: Array<User>) => {
	roomUsers.set(users);
};
export const setUser = (usr: User) => {
	user.set(usr);
};
