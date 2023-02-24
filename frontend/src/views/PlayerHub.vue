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
          <strong>Имя (для отображения на странице профиля игрока): </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
          <input
            v-model="name"
            name="name"
            class="form-control"
          />
        </div>
      </div>
      <div class="row text-white">
        <p class="col-md-12">
          <strong>О себе/предпочтения в игре: </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
          <textarea
            v-model="info"
            name="info"
            placeholder="Расскажите о себе как об игроке. Вольный формат. :-)"
            class="form-control"
            rows="5"
          />
        </div>
      </div>
      <div class="row text-white">
        <p class="col-md-12">
          <strong>Пример поста: </strong>
        </p>
      </div>
      <div class="row">  
        <div class="col-md-12">
          <textarea
            v-model="post"
            name="info"
            class="form-control"
            rows="10"
            placeholder="Любой свой пост от любого персонажа, или сборная солянка - помогает в поиске соигроков."
          />
        </div>
      </div>
      <p />
      <div class="row">
        <div
          class="col-md-12"
          align="right"
          @click.prevent="save()"
        >
          <base-button
            type="success"
          >
            Сохранить
          </base-button>
        </div>
      </div>
    </div>
    <p />
    <div class="container">
      <div class="row">
        <div class="col-md-4">
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
        <div class="col-md-8">
          <p />
          <div class="row">
            <div class="col-md-4">
              <div class="row text-white">
                <h6 class="text-primary text-uppercase">
                  Новый персонаж
                </h6>
              </div>  
              <div class="row text-white">
                <div>Имя персонажа</div>
              </div>
              <div class="row text-white">
                <input
                  v-model="newCharacter.name"
                  placeholder="Имя персонажа"
                  class="form-control col-md-11"
                >
              </div>
              <div class="row text-white">
                <div>Дата рождения</div>
              </div>
              <div class="row text-white">
                <div>
                  <base-input addon-left-icon="ni ni-calendar-grid-58">
                    <flat-picker
                      v-model="newCharacter.dob"
                      slot-scope="{focus, blur}"
                      :config="{allowInput: true}"
                      class="form-control datepicker"
                      @on-open="focus"
                      @on-close="blur"
                    />
                  </base-input>
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <p />
              <div class="row text-white">
                <div>Статус</div>
              </div>
              <div class="row text-white">
                <input
                  v-model="newCharacter.status"
                  class="form-control col-md-12"
                >
              </div>
              <div class="row text-white">
                <div>Информация/Анкета</div>
              </div>
              <div class="row text-white">
                <textarea
                  v-model="newCharacter.info"
                  class="form-control form-control-alternative"
                  rows="6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-md-12"
          align="right"
          @click.prevent="addCharacter()"
        >
          <base-button type="success">
            Добавить персонажа
          </base-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getPlayer, savePlayer } from '../services/PlayerService';
import {getCharacters, addCharacter} from '../services/CharacterService';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';


export default {
  name: 'PlayerHub',
  components: { flatPicker, BaseButton, BaseInput },
  data () {
    return {
      claims: [],
      id: "",
      email: "",
      name: "",
      info: "",
      post: "",
      characters: [],
      newCharacter: {
        name: "",
        dob: "1987-07-20",
        info: "",
        img: "",
        status: ""
      }
    }
  },
  async created () {
    const idToken = await this.$auth.tokenManager.get('idToken');
    this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }))
    this.claims.forEach((value) => {
      if (value.key == 'email') this.email = value.value;
    });
    getPlayer(this.email).then(response => {
        if (response.length==0) {
          savePlayer({email: this.email}).then(addResponse => {
            this.id = addResponse;
          });
        } else {
        this.id = response[0].id;
        this.info = response[0].info;
        this.post = response[0].post;
        this.name = response[0].nickname;
        getCharacters(this.id).then(characters => {
            this.characters = characters;
        });
        }
    });
  },
  methods: {
    save() {
      const payload = {
        id: this.id,
        info: this.info,
        post: this.post,
        email: this.email,
        nickname: this.name
      };
      savePlayer(payload).then(() => this.$router.go());
    },
    addCharacter() {
        const payload = {
          player_id: this.id,
          name: this.newCharacter.name,
          dob: this.newCharacter.dob,
          info: this.newCharacter.info,
          img: this.newCharacter.img,
          status: this.newCharacter.status
        }
        addCharacter(payload);
        this.newCharacter = {};
        getCharacters(this.id).then(characters => {
            this.characters = characters;
        });
    }
  }
}
</script>