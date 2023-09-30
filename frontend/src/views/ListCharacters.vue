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
          {{ $t('characters') }}
        </h1>
      </div>
      <card>
        <div class="row">
          <div
            v-for="item in characters"
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
import {getAllCharacters} from '../services/CharacterService';

export default {
  name: 'ListCharacters',
  data () {
    return {
      characters: [],
    }
  },
  mounted() {
    getAllCharacters().then(characters => {
        this.characters = characters;
    });
    document.title = "Glory - Список персонажей";    
  }
}
</script>