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
          {{ $t('stories') }} ({{ episodes.length }})
        </h1>
      </div>
      <div class="row">
        <div class="col-md-3">
          <multiselect
            v-model="current_status" 
            :options="status_filter" 
            :searchable="true" 
            :multiple="false"
            :close-on-select="true" 
            label="status"
            track-by="id"
            :show-labels="false"
            @select="selectStatus"
          />
        </div>
        <div class="col-md-9">      
          <badge
            v-if="branch_id != 0"
            type="primary"
            @click="filterByBranch(0)"
          >
            {{ $t('stopFilteringBy')}} "{{ branch_name }}"
          </badge>
          <badge
            v-if="player_id != 0 && filteredByPlayer == false"
            type="primary"
            @click="filterByPlayer"
          >
            {{ $t('showMyStories')}}
          </badge>
          <badge
            v-if="filteredByPlayer"
            type="primary"
            @click="clearPlayerFilter"
          >
            {{ $t('stopFilteringByMine')}}
          </badge>
        </div>
      </div>
      <card>
        <div v-if="episodes.length == 0">
          {{ $t('noStoriesSorry')}}
        </div>
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
                  <badge
                    v-for="branch in item.branches"
                    :key="branch.id"
                    type="primary"
                    @click="filterByBranch(branch.id, branch.description)"
                  >
                    {{ branch.description }}
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
import { getEpisodes, getAllBranches } from '../services/EpisodeService';
import { getEpisodesByPlayerId, getPlayer } from '../services/PlayerService';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

    export default {
        name: 'EpisodesList',
        components: { Multiselect },
        props: [],
        data() {
            return {
                episodes: [],
                allBranches: [],
                branch_id: 0,
                branch_name: 'Все коллекции',
                email: '',
                player_id: 0,
                filteredByPlayer: false,
                status_filter: [{id: 0, status: 'Всё подряд'}, 
                                {id: 3, status: 'В процессе'}, 
                                {id: 2, status: 'Завершён'}, 
                                {id: 4, status: 'Черновик'}],
                current_status: {id: 0, status: 'Всё подряд'}                
            }
        },
        async created () {
            let uri = window.location.search.substring(1); 
            let params = new URLSearchParams(uri);
            document.title = "Glory - Эпизоды";
            if (params.get("branch_id")) this.branch_id = params.get("branch_id");
            if (this.branch_id != 0) {
                getEpisodes(this.current_status.id, this.branch_id).then(response => {
                    this.episodes = response;
                    getAllBranches().then(allBranches => {
                        this.allBranches = allBranches;
                        this.branch_name = (this.allBranches.filter(item => item.id == this.branch_id))[0].description;
                        this.episodes.forEach((ep, i) => {
                            const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                            const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                            this.episodes[i].branches = branches;                                                
                        });
                    });
                });
            }
            if (this.authState && this.authState.isAuthenticated && this.branch_id == 0) {
                const idToken = await this.$auth.tokenManager.get('idToken');
                this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
                this.claims.forEach((value) => {
                  if (value.key == 'email') this.email = value.value;
                });
                if (this.email != '') {
                    getPlayer(this.email).then(response => {
                        this.player_id = response[0].id;   
                        getEpisodesByPlayerId(this.player_id, this.current_status.id).then(response => {
                            this.episodes = response;
                            getAllBranches().then(allBranches => {
                                this.allBranches = allBranches;
                                this.filteredByPlayer = true;
                                this.episodes.forEach((ep, i) => {
                                    const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                                    console.log(branchIdsArray);
                                    console.log(this.allBranches);
                                    const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                                    this.episodes[i].branches = branches;  
                                });
                            });
                          }); 
                    });
                }               
            }
            if (!(this.authState && this.authState.isAuthenticated) && this.branch_id == 0) {
                getEpisodes(this.current_status.id, this.branch_id).then(response => {
                    this.episodes = response;
                    getAllBranches().then(allBranches => {
                        this.allBranches = allBranches;
                        this.episodes.forEach((ep, i) => {
                            const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                            const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                            this.episodes[i].branches = branches;                                                
                        });
                    });
                });
            }                     
          },
        methods: {
        selectStatus() {
            if (this.filteredByPlayer) this.filterByPlayer();
            else
            getEpisodes(this.current_status.id, this.branch_id).then(response => {
                this.episodes = response;
                this.episodes.forEach((ep, i) => {
                    const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                    const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                    this.episodes[i].branches = branches;    
                });
            }); 
        },
        filterByStatus(id, status) {
            this.current_status = {id: id, status: status};
            this.selectStatus()
        },
        filterByBranch(branch_id, branch_name) {
            this.branch_id = branch_id;
            this.branch_name = branch_name;
            getEpisodes(this.current_status.id, this.branch_id).then(response => {
                this.episodes = response;
                this.episodes.forEach((ep, i) => {
                    const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                    const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                    this.episodes[i].branches = branches;    
                });
            }); 
        },
        filterByPlayer() {
            getEpisodesByPlayerId(this.player_id, this.current_status.id).then(response => {
                this.episodes = response;
                this.filteredByPlayer = true;
                this.episodes.forEach((ep, i) => {
                    const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                    const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                    this.episodes[i].branches = branches;    
                });
            });
        },
        clearPlayerFilter() {
          this.filteredByPlayer = false;
          getEpisodes(this.current_status.id, this.branch_id).then(response => {
                this.episodes = response;
                this.episodes.forEach((ep, i) => {
                    const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                    const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                    this.episodes[i].branches = branches;    
                });
            });
        }
        },
     }
</script>
<style>
</style>