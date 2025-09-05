export {};

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string;
						callback: (response: any) => void;
					}) => void;
					renderButton: (
						parent: HTMLElement,
						options: {
							theme: string;
							size: string;
							text: string;
							shape: string;
							logo_alignment: string;
						}
					) => void;
				};
			};
		};
	}
}
