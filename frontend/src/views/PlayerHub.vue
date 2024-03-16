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
        <tab :name="$t('stats')">
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <card>
                  <h6 class="text-primary text-uppercase">
                    {{ $t('debtsToMe') }}:
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
                    {{ $t('debtsFromMe') }}:
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
                  {{ $t('personalMessagesCount') }}: {{ postsN }}
                </card>
              </div>  
            </div>
          </div>
          <p />
        </tab>
        <tab :name="$t('profile')">
          <div class="row">
            {{ $t('playerName') }}: 
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
            {{ $t('aboutMe') }}: 
          </div>
          <div class="row">  
            <div class="col-md-12">
              <quill-editor
                v-model:content="info" 
                content-type="html" 
                :options="options"
                class="form-control rounded-0"
                style="height: 250px"
                placeholder="Расскажите о себе как об игроке. Вольный формат. :-)"
              />
            </div>
          </div><p />
          <div class="row">
            {{ $t('postExample') }}: 
          </div>
          <div class="row">  
            <div class="col-md-12">
              <quill-editor
                v-model:content="post" 
                content-type="html" 
                :options="options"
                class="form-control rounded-0"
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
              @click="save()"
            >
              <base-button
                type="success"
              >
                {{ $t('save') }}
              </base-button>
            </div>
          </div>    
        </tab>
        <tab :name="$t('characters')">
          <div class="row">
            <div class="col-md-4">
              <card>
                <h6 class="text-primary text-uppercase">
                  {{ $t('characters') }}
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
            <div class="col-md-8">
              <p />
              <div class="row">
                <div class="col-md-12">
                  <div class="row">
                    <h6 class="text-primary text-uppercase">
                      {{ $t('newCharacter') }}
                    </h6>
                  </div>  
                  <div class="row">
                    <div>{{ $t('characterName') }}</div>
                  </div>
                  <div class="row text-white">
                    <input
                      v-model="newCharacter.name"
                      class="form-control col-md-11"
                    >
                  </div><p />
                  <div class="row">
                    <div>{{ $t('characterDOB') }}</div>
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
                    <div>{{ $t('status') }}</div>
                  </div>
                  <div class="row">
                    <input
                      v-model="newCharacter.status"
                      class="form-control col-md-11"
                    >
                  </div>
                  <p />
                  <div class="row">
                    <div>{{ $t('characterInfo') }}</div>
                  </div>
                  <div class="row">
                  <p class="col-md-11">
                    <quill-editor
                      v-model:content="newCharacter.info" 
                      content-type="html" 
                      :options="options"
                      class="form-control rounded-0 "
                    />
                    </p>
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
                {{ $t('addCharacter') }}
              </base-button>
            </div>
          </div>
        </tab>
        <tab :name="$t('feedbackToMe')">
          <div v-if="feedback.length == 0">
            {{ $t('noFeedbackYet') }}
          </div>
          <table class="table table-bordered">
            <thead>
              <th>{{ $t('text') }}</th>
              <th>{{ $t('from') }}</th>
              <th>{{ $t('when') }}</th>
              <th>{{ $t('forTheMessage') }}</th>
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
        <tab :name="$t('feedbackFromMe')">
          <div v-if="comments.length == 0">
            {{ $t('leaveFeedback') }}
          </div>
          <table
            v-if="comments.length > 0"
            class="table table-bordered"
          >
            <thead>
              <th>{{ $t('text') }}</th>
              <th>{{ $t('to') }}</th>
              <th>{{ $t('when') }}</th>
              <th>{{ $t('forTheMessage') }}</th>
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
import { getPlayer, getPlayerById, savePlayer, getDebts, getEpisodesByPlayerId, 
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
              toolbar: [['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }, { 'background': [] }], ['clean']]
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
            getPlayerById(this.id).then(playerInfo => {
                this.info = playerInfo[0].info;
                this.post = playerInfo[0].post;
                this.name = playerInfo[0].nickname;
            });
            getCharacters(this.id).then(characters => {
                this.characters = characters;
            });
        }
        getDebts().then(response => {
            getEpisodesByPlayerId(this.id, 0).then(eps => {
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
      let processed_info = this.info.replaceAll('-- ', '— ').replaceAll('- ', '— ').replaceAll('  ', ' ');
      let processed_text = this.post.replaceAll('-- ', '— ').replaceAll('- ', '— ').replaceAll('  ', ' ');
      const payload = {
        id: this.id,
        info: processed_info,
        post: processed_text,
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