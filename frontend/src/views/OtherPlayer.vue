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
        {{ $t('profile') }}
      </h6>
      <div class="row text-white">
        <p class="col-md-12">
          <strong>{{ $t('aboutMe') }}: </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
          <card>
            <div
              name="info"
              style="white-space:pre-wrap; text-justify: auto;" 
              v-html="info"
            />
          </card>
        </div>
      </div>
      <div class="row text-white">
        <p class="col-md-12">
          <strong>{{ $t('postExample') }}: </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
          <card>
            <div
              name="post"
              style="white-space:pre-wrap; text-justify: auto;"
              v-html="post"
            />
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
              {{ $t('characters') }} ({{ characters.length }})
            </h6>
            <div v-if="characters.length == 0">
              {{ $t('addCharacters') }}
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
              {{ $t('stories') }} ({{ episodes.length }})
            </h6>
            <div v-if="episodes.length == 0">
              {{ $t('noStoriesPlayer') }}
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
                >
                  {{ item.status }}
                </badge>
                <badge
                  v-if="item.status == 'Завершен'"
                  type="success"
                >
                  {{ item.status }}
                </badge>
                <badge
                  v-if="item.status == 'В процессе'"
                  type="default"
                >
                  {{ item.status }}
                </badge>
                <badge
                  v-if="item.status == 'Черновик'"
                  type="info"
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
        document.title = "Glory - " + response[0].nickname;
        getCharacters(this.id).then(characters => {
            this.characters = characters;
        });
        getEpisodesByPlayerId(this.id, 0).then(episodes => {
            this.episodes = episodes;
        })
    });
  },
  methods: {
  }
}
</script>