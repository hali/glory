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
          Персонажи
        </h1>
      </div>
      <card>
        <div class="row">
          <div
            v-for="item in players"
            :key="item.id"
            class="col-md-2"
          >
            <router-link
              :to="{
                name: 'viewcharacter', 
                params: { id:item.id }                              
              }"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div> 
      </card>   
    </div>
  </section>
</template>

<script>
import {getAllPlayers} from '../services/CharacterService';

export default {
  name: 'ListPlayers',
  data () {
    return {
      players: [],
    }
  },
  mounted() {
    getAllPlayers().then(players => {
        this.players = players;
    });
    document.title = "Glory - Игроки";    
  }
}
</script>