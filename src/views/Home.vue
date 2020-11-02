<template>
  <div class="home">
    <v-data-table
      :headers="headers"
      :items="pairs"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Update Rate (secs)
              </v-btn>
            </template>
            <v-list flat>
              <v-list-item link v-for="rate in updateRates" :key="rate.value">
                <v-list-item-icon>
                  <v-icon v-if="rate.value === updateRate">verified</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title @click="setUpdateRate(rate.value)">{{
                    rate.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </template></v-data-table
    >
  </div>
</template>

<script lang="ts">
import { MarketInfoItem } from '@/store/marketInfo';
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';

@Component({
  methods: {
    ...mapActions('marketInfo', ['fetchPairs'])
  },
  computed: {
    ...mapGetters('marketInfo', ['pairs', 'loading', 'error'])
  }
})
export default class Home extends Vue {
  pairs!: MarketInfoItem[];
  loading!: boolean;
  error!: string;

  fetchPairs!: () => Promise<void>;

  headers = [
    { text: 'From', value: 'from' },
    { text: 'To', value: 'to' },
    { text: 'Max', value: 'max' },
    { text: 'Min', value: 'min' },
    { text: 'Rate', value: 'rate' },
    { text: 'Status', value: 'status' }
  ];

  updateRates = [
    {
      name: 5,
      value: 5000
    },
    {
      name: 10,
      value: 10000
    },
    {
      name: 15,
      value: 15000
    }
  ];

  updateRate = 5000;

  interval!: number;

  async beforeMount() {
    await this.fetchPairs();
    this.createIntervalUpdate();
  }

  setUpdateRate(rate: number) {
    this.updateRate = rate;
    this.createIntervalUpdate();
  }

  createIntervalUpdate() {
    this.interval = setInterval(async () => {
      await this.fetchPairs();
    }, this.updateRate);
  }
}
</script>
