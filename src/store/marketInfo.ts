import axios from 'axios';
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree
} from 'vuex';
import { SET_ERROR, SET_LOADING_PAIRS, SET_PAIRS } from './mutation-types';
const { VUE_APP_MARKETINFO_URL } = process.env;

export interface MarketInfoItem {
  from: string;
  to: string;
  rate: number;
  orderExpiresIn: number;
  status: string;
  max: number;
  min: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketInfoState {
  pairs: MarketInfoItem[];
  loadingPairs: boolean;
  error: string | null;
}

const state = (): MarketInfoState => ({
  pairs: [],
  loadingPairs: false,
  error: null
});

const getters: GetterTree<MarketInfoState, {}> = {
  pairs(state) {
    return state.pairs;
  },
  loading(state) {
    return state.loadingPairs;
  },
  error(state) {
    return state.error;
  }
};

const mutations: MutationTree<MarketInfoState> = {
  [SET_LOADING_PAIRS](state: MarketInfoState, loading: boolean) {
    state.loadingPairs = loading;
  },

  [SET_PAIRS](state: MarketInfoState, pairs: MarketInfoItem[]) {
    state.pairs = [...pairs];
  },

  [SET_ERROR](state: MarketInfoState, error: string) {
    state.error = error;
  }
};

const actions: ActionTree<MarketInfoState, {}> = {
  async fetchPairs({ commit }: ActionContext<MarketInfoState, {}>) {
    commit(SET_LOADING_PAIRS, true);
    commit(SET_PAIRS, []);
    try {
      const { data } = await axios(VUE_APP_MARKETINFO_URL);
      commit(SET_PAIRS, data);
      commit(SET_LOADING_PAIRS, false);
    } catch (error) {
      commit(SET_LOADING_PAIRS, false);
      commit(SET_ERROR, error.message);
    }
  }
};

export const marketInfo: Module<MarketInfoState, {}> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
