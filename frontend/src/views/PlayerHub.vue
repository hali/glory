<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <section class="section section-lg pt-lg-0 section-shaped my-0">
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
        <h1 class="display-3  text-white">
          {{ name }}
        </h1>
      <tabs>
      <tab name="Статистика">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <card>
              <h6 class="text-primary text-uppercase">
                Жду ответа:
              </h6>
              <div
                v-for="item in waitingFor"
                :key="item.id"
              >
                <router-link
                  :to="{
                    name: 'viewepisode', 
                    params: { id:item.id }                              
                  }"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </card>
          </div> 
          <div class="col-md-6">
            <card>
              <h6 class="text-primary text-uppercase">
                Мои долги:
              </h6>
              <div
                v-for="item in myDebts"
                :key="item.id"
              >
                <router-link
                  :to="{
                    name: 'viewepisode', 
                    params: { id:item.id }                              
                  }"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </card>
          </div> 
         
        </div>
         <p />
        <div class="row">
          <div class="col-md-12">
            <card>
            Постов на сайте за всех персонажей в сумме выложено: {{ postsN }}
            </card>
          </div>  
        </div>
      </div>
      <p />
      </tab>
      <tab name = "Профиль">
      <div class="row">
          Имя (для отображения на странице профиля игрока): 
      </div>
      <div class="row">  
        <div class="col-md-12">
          <input
            v-model="name"
            name="name"
            class="form-control"
          >
        </div>
      </div><p />
      <div class="row">
          О себе/предпочтения в игре: 
      </div>
      <div class="row">  
        <div class="col-md-12">
          <quill-editor
            v-model:content="info" 
            content-type="html" 
            :options="options"
            class="form-control"
            style="height: 250px"
            placeholder="Расскажите о себе как об игроке. Вольный формат. :-)"
          />
        </div>
      </div><p />
      <div class="row">
          Пример поста: 
      </div>
      <div class="row">  
        <div class="col-md-12">
          <quill-editor
            v-model:content="post" 
            content-type="html" 
            :options="options"
            class="form-control"
            style="height: 250px"
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
    </tab>
    <tab name = "Персонажи">
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
            <div class="col-md-12">
              <div class="row">
                <h6 class="text-primary text-uppercase">
                  Новый персонаж
                </h6>
              </div>  
              <div class="row">
                <div>Имя персонажа</div>
              </div>
              <div class="row text-white">
                <input
                  v-model="newCharacter.name"
                  placeholder="Имя персонажа"
                  class="form-control col-md-11"
                >
              </div><p />
              <div class="row">
                <div>Дата рождения</div>
              </div>
              <div class="row">
                <div>
                  <base-input addon-left-icon="ni ni-calendar-grid-58">
                    <flat-picker
                      v-model="newCharacter.dob"
                      slot-scope="{focus, blur}"
                      :config="{allowInput: true, dateFormat: 'Y-m-d', disableMobile: true}"
                      class="form-control datepicker"
                      @on-open="focus"
                      @on-close="blur"
                    />
                  </base-input>
                </div>
              </div>
              <p />
              <div class="row">
                <div>Статус</div>
              </div>
              <div class="row text-white">
                <input
                  v-model="newCharacter.status"
                  class="form-control col-md-12"
                >
              </div><p />
              <div class="row">
                <div>Информация/Анкета</div>
              </div>
              <div class="row text-white">
                <quill-editor
                  v-model:content="newCharacter.info" 
                  content-type="html" 
                  :options="options"
                  class="form-control"
                  style="height: 250px"
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
    </tab>
    <tab name = "Фидбек мне">
        <div v-if="feedback.length == 0">
          У вас пока нет фидбека. :-(
        </div>
        <table class="table table-bordered">
          <thead>
            <th>Текст</th>
            <th>От кого</th>
            <th>Когда</th>
            <th>По поводу</th>
          </thead>
          <tbody>
            <tr
              v-for="item in feedback"
              :key="item.id"
            > 
              <td>
                {{ item.body }}
              </td>
              <td> {{ item.nickname }} </td>
              <td> {{ item.added_time }} </td>
              <td>
                <router-link
                  :to="{
                    name: 'viewepisode', 
                    params: { id:item.episode_id },
                    hash: '#' + item.post_id                             
                  }"
                >
                  {{ item.name }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>    
    </tab>
    <tab name = "Фидбек мой">
        <div v-if="comments.length == 0">
          Додайте людям фидбека, и он здесь появится!
        </div>
        <table
          v-if="comments.length > 0"
          class="table table-bordered"
        >
          <thead>
            <th>Текст</th>
            <th>Кому</th>
            <th>Когда</th>
            <th>По поводу</th>
          </thead>
          <tbody>
            <tr
              v-for="item in comments"
              :key="item.id"
            > 
              <td>
                {{ item.body }}
              </td>
              <td>
                {{ item.char_name }}
              </td>
              <td>
                {{ item.added_time }}
              </td>
              <td>
                <router-link
                  :to="{
                    name: 'viewepisode', 
                    params: { id:item.ep_id },
                    hash: '#' + item.post_id                              
                  }"
                >
                  {{ item.ep_name }}
                </router-link>  
              </td>
            </tr>
          </tbody>
        </table>    
    </tab>
    </tabs>
    </div>
  </section>
</template>

<script>
import { getPlayer, savePlayer, getDebts, getEpisodesByPlayerId, 
getCommentsByPlayer, getFeedbackByPlayer, getPostsNumber } from '../services/PlayerService';
import {getCharacters, addCharacter} from '../services/CharacterService';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '../assets/tab-components.css';

export default {
  name: 'PlayerHub',
  components: { flatPicker, BaseButton, BaseInput, QuillEditor },
  data () {
    return {
      claims: [],
      id: "",
      email: "",
      name: "",
      info: "",
      post: "",
      postsN: 0,
      characters: [],
      comments: [],
      feedback: [],
      episodes: [],
      newCharacter: {
        name: "",
        dob: "1987-07-20",
        info: "",
        img: "",
        status: ""
      },
      myDebts: [],
      waitingFor: [],
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
    document.title = "Glory - Мой портал";
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
        getDebts().then(response => {
            getEpisodesByPlayerId(this.id).then(eps => {
                this.episodes = eps;
                response.forEach((value) => {
                if (value.player_id == this.id) 
                    this.waitingFor.push({ id: value.ep_id, name: value.name});
                else if (this.episodes.find(e => e.id === value.ep_id))
                    this.myDebts.push({ id: value.ep_id, name: value.name});
                });
            });
        });
        getFeedbackByPlayer(this.id).then(response => {
            this.feedback = response;
            }
        );
        getCommentsByPlayer(this.id).then(response => {
            this.comments = response;
            }
        );
        getPostsNumber(this.id).then(response => {
        this.postsN = response[0].n_posts;
        });
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
          dob: (new Date(this.newCharacter.dob)).toISOString().split('T')[0],
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