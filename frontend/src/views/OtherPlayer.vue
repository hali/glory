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
          {{ name }}
        </h1>
      </div>
      <h6 class="text-primary text-uppercase">
        Профиль
      </h6>
      <div class="row text-white">
        <p class="col-md-12">
          <strong>О себе/предпочтения в игре: </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
        <card>
          <div
            name="info"
            placeholder="Расскажите о себе как об игроке. Вольный формат. :-)"
          > {{ info }}</div></card>
        </div>
      </div>
      <div class="row text-white">
        <p class="col-md-12">
          <strong>Пример поста: </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
          <card>
          <div
            name="post"
            placeholder="Любой свой пост от любого персонажа, или сборная солянка - помогает в поиске соигроков."
          >{{ post }}</div></card>
        </div>
      </div>
      </div>
    <p />
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <card>
            <h6 class="text-primary text-uppercase">
              Персонажи
            </h6>
            <div v-if="characters.length == 0">
              Добавьте персонажей!
            </div>
            <div
              v-for="item in characters"
              :key="item.id"
            >
              <p>
                <router-link
                  :to="{
                    name: 'viewcharacter', 
                    params: { id:item.id }                              
                  }"
                >
                  {{ item.name }}
                </router-link>
              </p>
            </div>
          </card>
        </div>
        <p />
        
      </div>
    </div>
  </section>
</template>

<script>
import { getPlayerById } from '../services/PlayerService';
import { getCharacters } from '../services/CharacterService';

export default {
  name: 'OtherPlayer',
  data () {
    return {
      id: this.$route.params.id,
      email: "",
      name: "",
      info: "",
      post: "",
      characters: []
    }
  },
  async created () {
    getPlayerById(this.id).then(response => {
        this.info = response[0].info;
        this.post = response[0].post;
        this.name = response[0].nickname;
        getCharacters(this.id).then(characters => {
            this.characters = characters;
        });
    });
  },
  methods: {
  }
}
</script>