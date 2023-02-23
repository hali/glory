<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <div class="container">
      <div class="row text-white">
        <h1 class="display-3  text-white">
          Эпизоды
        </h1>
      </div>
      <base-dropdown title="Статус">
          <base-button slot="title" type="primary" class="dropdown-toggle" >
            {{ status_name }}
          </base-button>
            <div><a class="dropdown-item" @click="filterByStatus(0, 'Все подряд')">
              Все подряд
            </a></div>
            <div><a class="dropdown-item" @click="filterByStatus(3, 'В процессе')">
              В процессе
            </a></div>
            <div><a class="dropdown-item" @click="filterByStatus(2, 'Завершен')">
              Завершен
            </a></div>
            <div><a class="dropdown-item" @click="filterByStatus(4, 'Черновик')">
              Черновик
            </a></div>
        </base-dropdown>
        <badge v-if="this.branch_id != 0" type="primary" @click="filterByBranch(0)">
            Сбросить фильтр по коллекции "{{ this.branch_name }}"
        </badge>
        <badge v-if="this.player_id != 0 && this.filteredByPlayer == false" type="primary" @click="filterByPlayer">
            Показать мои эпизоды
        </badge>
        <badge v-if="this.filteredByPlayer" type="primary" @click="clearPlayerFilter">
            Сбросить фильтр по моим эпизодам
        </badge>
      <card>
        <table class="table table-bordered">
          <tbody>
            <tr
              v-for="item in episodes"
              :key="item.id"
            > 
              <td>
                <router-link
                  :to="{
                    name: 'viewepisode', 
                    params: { id:item.id }                              
                  }"
                >
                  {{ item.name }} ({{ item.timeOfAction }})
                </router-link>
                <div>
                  <badge type="primary" @click="filterByBranch(item.branch_id, item.branch)">
                    {{ item.branch }}
                  </badge>
                  <badge
                    v-if="item.status == 'Заброшен'"
                    type="danger"
                    @click="filterByStatus(1, 'Заброшен')"
                  >
                    {{ item.status }}
                  </badge>
                  <badge
                    v-if="item.status == 'Завершен'"
                    type="success"
                    @click="filterByStatus(2, 'Завершен')"
                  >
                    {{ item.status }}
                  </badge>
                  <badge
                    v-if="item.status == 'В процессе'"
                    type="default"
                    @click="filterByStatus(3, 'В процессе')"
                  >
                    {{ item.status }}
                  </badge>
                  <badge
                    v-if="item.status == 'Черновик'"
                    type="info"
                    @click="filterByStatus(4, 'Черновик')"
                  >
                    {{ item.status }}
                  </badge>
                </div>
              </td>
            </tr>
          </tbody>
        </table>    
      </card>   
    </div>
  </section>
</template>
<script>
import { getEpisodes } from '../services/EpisodeService';
import { getEpisodesByPlayerId, getPlayer } from '../services/PlayerService';
import BaseDropdown from '@/components/BaseDropdown';
import BaseButton from '@/components/BaseButton';

    export default {
        name: 'EpisodesList',
        components: {BaseButton, BaseDropdown},
        props: [],
        data() {
            return {
                episodes: [],
                status: 0,
                status_name: 'Все подряд',
                branch_id: 0,
                branch_name: 'Все коллекции',
                email: '',
                player_id: 0,
                filteredByPlayer: false
            }
        },
        async created () {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            if (this.email != '')
                getPlayer(this.email).then(response => {
                    this.player_id = response[0].id;   
                    getEpisodesByPlayerId(this.player_id).then(response => {
                        this.episodes = response;
                        this.filteredByPlayer = true;
                    });                 
                });    
            let uri = window.location.search.substring(1); 
            let params = new URLSearchParams(uri);
            if (params.get("branch_id")) this.branch_id = params.get("branch_id");
            if (this.player_id == 0) getEpisodes(this.status, this.branch_id).then(response => {
                this.episodes = response;
                this.branch_name = this.episodes[0].branch;
            });              
          },
        methods: {
        filterByStatus(status, status_name) {
            this.status = status;
            this.status_name = status_name;
            getEpisodes(this.status, this.branch_id).then(response => {
                this.episodes = response;
            }); 
        },
        filterByBranch(branch_id, branch_name) {
            this.branch_id = branch_id;
            this.branch_name = branch_name;
            getEpisodes(this.status, this.branch_id).then(response => {
                this.episodes = response;
            }); 
        },
        filterByPlayer() {
            getEpisodesByPlayerId(this.player_id).then(response => {
                this.episodes = response;
                this.filteredByPlayer = true;
            });
        },
        clearPlayerFilter() {
          this.filteredByPlayer = false;
          getEpisodes(this.status, this.branch_id).then(response => {
                this.episodes = response;
            });
        }
        },
     }
</script>
<style>
</style>