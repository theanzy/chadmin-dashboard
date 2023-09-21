export type EventDispatcher<TEvents extends Record<keyof TEvents, CustomEvent<any>>> = {
	[Property in keyof TEvents]: TEvents[Property]['detail'];
};
