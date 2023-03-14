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
            >
              {{ info }}
            </div>
          </card>
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
              style="white-space:pre-wrap; text-justify: auto;"
            >
              {{ post }}
            </div>
          </card>
        </div>
      </div>
    </div>
    <p />
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <card>
            <h6 class="text-primary text-uppercase">
              Персонажи ({{ characters.length }})
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
    <p />
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <card>
            <h6 class="text-primary text-uppercase">
              Эпизоды ({{ episodes.length }})
            </h6>
            <div v-if="episodes.length == 0">
              Нет эпизодов у этого игрока :-(
            </div>
            <div
              v-for="item in episodes"
              :key="item.id"
              class="row"
            >
              <div class="col-md-8">
                <router-link
                  :to="{
                    name: 'viewepisode', 
                    params: { id:item.id }                              
                  }"
                >
                  {{ item.name }}
                </router-link>
              </div>
              <div
                class="col-md-4"
                align="right"
              >
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
            </div>
          </card>
        </div>
        <p />
      </div>
    </div>
  </section>
</template>

<script>
import { getPlayerById, getEpisodesByPlayerId } from '../services/PlayerService';
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
      characters: [],
      episodes: []
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
        getEpisodesByPlayerId(this.id).then(episodes => {
            this.episodes = episodes;
        })
    });
  },
  methods: {
  }
}
</script>