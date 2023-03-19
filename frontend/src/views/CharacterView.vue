<!-- eslint-disable vue/no-v-model-argument -->
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
    <div
      class="container text-white"
      align="center"
    >
      <div class="row text-white">
        <h1 class="display-3  text-white">
          {{ name }}
        </h1>
      </div>
    </div>
    <div class="container card-profile-image">
      <img
        :src="`${img}`"
        class="rounded img-fluid"
      >
    </div>
    <div class="container">
      <div
        v-if="player_id == character_player_id"
        class="row text-white"
      >
        <p class="col-md-12">
          Имя персонажа:
        </p>
      </div>
      <div
        v-if="player_id == character_player_id"
        class="row"
      >  
        <div class="col-md-12">
          <input
            v-model="name" 
            class="form-control col-md-12"
            name="name"
          >
        </div>
      </div>
      <div
        v-if="player_id == character_player_id"
        class="row text-white"
      >
        <p class="col-md-12">
          URL аватарки:
        </p>
      </div>
      <div
        v-if="player_id == character_player_id"
        class="row"
      >  
        <div class="col-md-12">
          <input
            v-model="img" 
            class="form-control col-md-12"
            name="img"
          >
        </div>
      </div>
      <div class="row text-white">
        <div class="col-md-6">
          <p>Статус:</p>
          <input
            v-model="status"
            class="form-control col-md-12" 
            name="status"
            :disabled="player_id !== character_player_id"
          >
        </div> 
        <div class="col-md-6">
          <p>
            Дата рождения:
          </p>
          <base-input addon-left-icon="ni ni-calendar-grid-58">
            <flat-picker
              v-model="dob"
              slot-scope="{focus, blur}"
              :config="{allowInput: true, dateFormat: 'Y-m-d', disableMobile: true}"
              class="form-control datepicker"
              :disabled="player_id !== character_player_id"
              @on-open="focus"
              @on-close="blur"
            />
          </base-input>  
        </div>
      </div>  
      <div class="row text-white">
        <p class="col-md-12">
          Анкета/Информация о персонаже:
        </p>
      </div>
      <div
        v-if="player_id == character_player_id"
        class="row"
      >  
        <div class="col-md-12">
          <quill-editor v-model:content="info" 
            contentType="html" 
            :options=options
            class="form-control"
            style="height: 250px"
            />
        </div>
      </div>
      <card v-if="player_id != character_player_id">
        <div style="white-space:pre-wrap; text-justify: auto;" v-html="info">
        </div>
      </card>
      <div class="row">
        <p />
      </div>
      <div
        v-if="player_id == character_player_id"
        class="row"
      >
        <div
          class="col-md-12"
          align="right"
        >  
          <span @click="save()"> <base-button type="success">
            Сохранить персонажа
          </base-button></span>
        </div>
      </div>
      <div
        v-if="player_id != character_player_id"
        class="row"
      >
        <div
          class="col-md-12"
          align="right"
        >  
          <router-link
            :to="{
              name: 'viewotherplayer', 
              params: { id: character_player_id }                              
            }"
          >
            Игрок
          </router-link>
        </div>
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
              Нет эпизодов с этим персонажем :-(
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
import { getPlayer, getPlayerById } from '../services/PlayerService';
import { getCharacter, saveCharacter, getEpisodesByCharacterId } from '../services/CharacterService';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  name: 'CharacterView',
  components: { flatPicker, BaseButton, BaseInput, QuillEditor },
  data () {
    return {
      claims: [],
      player_id: "",
      id: this.$route.params.id,
      name: "",
      info: "",
      status: "",
      img: "",
      dob: "1987-07-20",
      character_player_id: 1,
      character_player_name: "",
      episodes: [],
      options: {
        debug: 'warn',
        modules: {
          toolbar: [['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }, { 'background': [] }]]
        },
        readOnly: false,
        theme: 'snow'
      }
    }
  },
  async created () {
    const idToken = await this.$auth.tokenManager.get('idToken');
    this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
    this.claims.forEach((value) => {
      if (value.key == 'email') this.email = value.value;
    });
    getPlayer(this.email).then(response => {
        this.player_id = response[0].id;
    });
    getCharacter(this.id).then(response => {
        this.name = response[0].name;
        this.dob = (new Date(response[0].dob)).toISOString().split('T')[0];
        this.info = response[0].info;
        this.status = response[0].status;
        this.img = response[0].img;
        this.character_player_id = response[0].player_id;
        getPlayerById(this.character_player_id).then(response => {
          this.character_player_name = response[0].email;
        });
        document.title = "Glory - " + response[0].name;
        }
    );
    getEpisodesByCharacterId(this.id).then(response => this.episodes = response);
  },
  methods: {
    save() {
      const payload = {
          name: this.name,
          dob: (new Date(this.dob)).toISOString().split('T')[0],
          info: this.info,
          img: this.img,
          status: this.status
        }
        saveCharacter(this.id, payload);
    }
  }
}
</script>