/// <reference types="@types/google.maps" />
export {};

declare global {
		interface Window {
			google?: typeof google & {
				accounts?: {
					id: {
						initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
						renderButton: (parent: HTMLElement, options: { theme: string; size: string; text: string; shape: string; logo_alignment: string }) => void;
					};
				};
			};
		}
}
