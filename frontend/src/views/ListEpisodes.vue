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
            v-if="selectedBranches.length > 0"
            type="primary"
            @click="clearBranchFilters"
          >
            {{ $t('clearAllFilters') || 'Clear all filters' }}
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
      
      <!-- Tag Cloud for Branches -->
      <div class="tag-cloud mt-3 mb-3">
        <badge
          v-for="branch in allBranches"
          :key="branch.id"
          :type="isBranchSelected(branch.id) ? 'success' : 'primary'"
          :class="{'selected-branch': isBranchSelected(branch.id)}"
          @click="toggleBranchFilter(branch.id)"
          class="mr-2 mb-2"
        >
          {{ branch.description }}
          <span v-if="isBranchSelected(branch.id)" class="badge-counter">
            <i class="fa fa-check"></i>
          </span>
        </badge>
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
                  {{ item.name }} ({{ item.dateOfAction }})
                </router-link>
                <div>
                  <badge
                    v-for="branch in item.branches"
                    :key="branch.id"
                    :type="isBranchSelected(branch.id) ? 'success' : 'primary'"
                    @click="toggleBranchFilter(branch.id)"
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
                allEpisodes: [], // Store all episodes for client-side filtering
                allBranches: [],
                selectedBranches: [], // Array of selected branch IDs for multi-tag filtering
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
            // Always load all branches for the tag cloud
            getAllBranches().then(allBranches => {
                this.allBranches = allBranches;
                
                // Check for URL parameter for branch_id
                if (params.get("branch_id")) {
                    this.branch_id = parseInt(params.get("branch_id"));
                    if (this.branch_id !== 0) {
                        // Add the branch from URL to selected branches
                        this.selectedBranches = [this.branch_id];
                        this.branch_name = (this.allBranches.filter(item => item.id == this.branch_id))[0]?.description || 'Unknown';
                    }
                }
                
                // Load episodes and apply filters
                this.applyFilters();
            });
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
                                  if (ep.branch_ids !== null)   
                                  {
                                    const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                                    const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                                    this.episodes[i].branches = branches;  
                                  }
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
                          if (ep.branch_ids !== null)   
                          {
                            const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                            const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                            this.episodes[i].branches = branches;  
                          }                                                
                        });
                    });
                });
            }
          },
        methods: {
        selectStatus() {
            if (this.filteredByPlayer) {
                this.filterByPlayer();
            } else {
                this.applyFilters();
            }
        },
        filterByStatus(id, status) {
            this.current_status = {id: id, status: status};
            this.selectStatus()
        },
        // New method to check if a branch is selected
        isBranchSelected(branchId) {
            return this.selectedBranches.includes(branchId);
        },
        
        // Toggle a branch in the multi-tag filter
        toggleBranchFilter(branchId) {
            const index = this.selectedBranches.indexOf(branchId);
            if (index > -1) {
                // Branch is already selected, remove it
                this.selectedBranches.splice(index, 1);
            } else {
                // Branch is not selected, add it
                this.selectedBranches.push(branchId);
            }
            this.applyFilters();
        },
        
        // Clear all branch filters
        clearBranchFilters() {
            this.selectedBranches = [];
            this.applyFilters();
        },
        
        // Apply all current filters
        applyFilters() {
            if (this.filteredByPlayer) {
                this.filterByPlayer();
                return;
            }
            
            // Get episodes based on status filter
            getEpisodes(this.current_status.id, 0).then(response => {
                this.allEpisodes = response;
                
                // Process all episodes to add branches
                this.allEpisodes.forEach((ep, i) => {
                    if (ep.branch_ids !== null) {
                        const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                        const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                        this.allEpisodes[i].branches = branches;
                        this.allEpisodes[i].branchIds = branchIdsArray;
                    } else {
                        this.allEpisodes[i].branches = [];
                        this.allEpisodes[i].branchIds = [];
                    }
                });
                
                // Filter by selected branches if any
                if (this.selectedBranches.length > 0) {
                    this.episodes = this.allEpisodes.filter(episode => {
                        if (!episode.branchIds || episode.branchIds.length === 0) {
                            return false;
                        }
                        // Check if episode has ALL of the selected branches
                        return this.selectedBranches.every(branchId => 
                            episode.branchIds.includes(branchId)
                        );
                    });
                } else {
                    // No branch filters, show all episodes
                    this.episodes = [...this.allEpisodes];
                }
            });
        },
        filterByPlayer() {
            getEpisodesByPlayerId(this.player_id, this.current_status.id).then(response => {
                this.allEpisodes = response;
                this.filteredByPlayer = true;
                
                // Process all episodes to add branches
                this.allEpisodes.forEach((ep, i) => {
                    if (ep.branch_ids !== null) {
                        const branchIdsArray = ep.branch_ids.split(',').map(id => parseInt(id));
                        const branches = this.allBranches.filter(item => branchIdsArray.includes(item.id));
                        this.allEpisodes[i].branches = branches;
                        this.allEpisodes[i].branchIds = branchIdsArray;
                    } else {
                        this.allEpisodes[i].branches = [];
                        this.allEpisodes[i].branchIds = [];
                    }
                });
                
                // Filter by selected branches if any
                if (this.selectedBranches.length > 0) {
                    this.episodes = this.allEpisodes.filter(episode => {
                        if (!episode.branchIds || episode.branchIds.length === 0) {
                            return false;
                        }
                        // Check if episode has ALL of the selected branches
                        return this.selectedBranches.every(branchId => 
                            episode.branchIds.includes(branchId)
                        );
                    });
                } else {
                    // No branch filters, show all episodes
                    this.episodes = [...this.allEpisodes];
                }
            });
        },
        clearPlayerFilter() {
            this.filteredByPlayer = false;
            this.applyFilters();
        }
        },
     }
</script>
<style>
/* Tag cloud styling */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.selected-branch {
  font-weight: bold;
  border: 2px solid #fff;
}

.badge-counter {
  margin-left: 5px;
}

/* Small animation for tag selection */
.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
  cursor: pointer;
}
</style>