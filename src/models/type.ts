export interface Type {
	url: string;
	name: string;
	id: number;
}

export interface SpecificType {
	name: string;
	weaknesses: Weaknes[];
	advantages: Advantage[];
}

export interface Weaknes {
	name: string;
	url: string;
}

export interface Advantage {
	name: string;
	url: string;
}
