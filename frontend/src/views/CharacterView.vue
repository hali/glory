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
    <div class="container text-white" align="center">
                       <div class="row text-white" >
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
              :config="{allowInput: true}"
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
      <div v-if="player_id == character_player_id" class="row">  
        <div class="col-md-12">
          <textarea
            id="exampleFormControlTextarea1"
            v-model="info"
            name="info"
            class="form-control form-control-alternative"
            rows="10"
          />
        </div>
      </div>
      <card v-if="player_id != character_player_id" >
      <div style="white-space:pre-wrap; text-justify: auto;">{{ info }}</div></card>
      <div class="row">
        <p />
      </div>
      <div class="row" v-if="player_id == character_player_id">
        <div
          class="col-md-12"
          align="right"
        >  
          <span @click="save()"> <base-button type="success">
            Сохранить персонажа
          </base-button></span>
        </div>
      </div>
      <div class="row" v-if="player_id != character_player_id">
          <div
              class="col-md-12"
              align="right"
            >  
              <router-link :to="{
                    name: 'viewotherplayer', 
                    params: { id: character_player_id }                              
                  }">Игрок</router-link>
            </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getPlayer, getPlayerById } from '../services/PlayerService';
import { getCharacter, saveCharacter } from '../services/CharacterService';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';

export default {
  name: 'CharacterView',
  components: { flatPicker, BaseButton, BaseInput },
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
      character_player_name: ""
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
        this.dob = response[0].dob;
        this.info = response[0].info;
        this.status = response[0].status;
        this.img = response[0].img;
        this.character_player_id = response[0].player_id;
        getPlayerById(this.character_player_id).then(response => {
          this.character_player_name = response[0].email;
        });
        }
    );
  },
  methods: {
    save() {
      const payload = {
          name: this.name,
          dob: this.dob,
          info: this.info,
          img: this.img,
          status: this.status
        }
        saveCharacter(this.id, payload);
    }
  }
}
</script>