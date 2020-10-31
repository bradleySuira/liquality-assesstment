import axios from 'axios';
import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { SET_ERROR, SET_LOADING_PAIRS, SET_PAIRS } from './mutation-types';
const { VUE_APP_MARKETINFO_URL } = process.env;

export interface MarketInfoState {
	pairs: {}[];
	loadingPairs: boolean;
	error: string | null;
}

export const state: MarketInfoState = {
	pairs: [],
	loadingPairs: false,
	error: null
};

export const mutations: MutationTree<MarketInfoState> = {
	[SET_LOADING_PAIRS](state: MarketInfoState, loading: boolean) {
		state.loadingPairs = loading;
	},

	[SET_PAIRS](state: MarketInfoState, pairs: {}[]) {
		state.pairs = [...pairs];
	},

	[SET_ERROR](state: MarketInfoState, error: string) {
		state.error = error;
	}
};

export const actions: ActionTree<MarketInfoState, {}> = {
	async fetchPairs({ commit }: ActionContext<MarketInfoState, {}>) {
		commit(SET_LOADING_PAIRS, true);
		commit(SET_PAIRS, []);
		try {
			const { data } = await axios(VUE_APP_MARKETINFO_URL);
			commit(SET_PAIRS, data);
		} catch (error) {
			commit(SET_LOADING_PAIRS, false);
			commit(SET_ERROR, error.message);
		}
	}
};
