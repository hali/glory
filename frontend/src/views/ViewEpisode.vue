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
    <div>
      <div class="container">
        <div class="row text-white">
          <h1 class="display-3  text-white">
            {{ episode.name }}
          </h1>
        </div>
        <div class="row text-white">
          <p class="col-md-6">
            <strong>Коллекции: </strong>
            <badge
              v-for="item in branches"
              :key="item.id"
              type="secondary"
            >
              <router-link :to="{name: 'episodes', query: {branch_id: item.id}}">
                {{ item.description }}
              </router-link>
            </badge>
          </p>
          <p class="col-md-6">
            <strong>Предупреждения: </strong> <badge type="secondary" />
          </p>
        </div>
        <div class="row text-white">
          <p class="col-md-6">
            <strong>Время действия:</strong> {{ episode.timeOfAction }}
          </p>
          <p class="col-md-6">
            <strong>Сеттинг (игровой мир):</strong> {{ episode.world }}
          </p>
        </div>
        <div class="row text-white">
          <p class="col-md-12">
            <strong>Участники: </strong> 
            <badge
              v-for="char in episode_characters"
              :key="char.id"
              type="secondary"
            >
              <router-link
                :to="{
                  name: 'viewcharacter', 
                  params: { id:char.id }                              
                }"
              >
                {{ char.name }}
              </router-link>
            </badge>
          </p>
        </div>
        <div
          class="row text-white"
        >
          <p class="col-md-12">
            <strong>Описание эпизода:</strong>
          </p> 
          <div
            class="col-md-11"
            style="white-space:pre-wrap; text-justify: auto;"
            type="light"
          >
            {{ episode.description }}
          </div>
          <div
            class="col-md-6"
            align="left"
          >
            <span
              v-if="current_player_id == episode.author_id" 
              class="col-md-3"
              align="left"
              @click="$router.push({ name: 'editepisode', params: { id: episode.id } })"
            ><base-button type="secondary">
              РЕДАКТИРОВАТЬ
            </base-button></span>
            
            <span
              v-if="(episode.status == 'В процессе') && (current_player_id == episode.author_id)" 
              class="col-md-3" 
              @click="closeEpisode"
            ><base-button type="secondary">
              Закрыть эпизод
            </base-button></span>
            <span
              v-if="['Завершен', 'Черновик'].includes(episode.status) && (current_player_id == episode.author_id)" 
              class="col-md-3" 
              @click="reopenEpisode"
            ><base-button type="secondary">
              Открыть эпизод
            </base-button></span>
          </div>
          <div
            class="col-md-6"
            align="right"
          >
            <base-button
              v-if="posts.length > 2"
              type="primary"
              @click.prevent="scrollToBottom()"
            >
              ВНИЗ
            </base-button>
          </div>
        </div>
        <div>
          <p />
          <div
            v-for="(item, index) in posts"
            :key="item.id"
          >
            <card
              class="border-0"
              shadow
              body-classes="py-5"
              type="lighter"
            >
              <div class="row">
                <div class="col-md-12" align="right">
                  <span>Пост добавлен: {{ item.added_time }}</span>
                </div>
              </div>
              <div
                :id="'#' + item.id"
                class="row"
              >
                <div class="col-md-2 card-profile-image">
                  <img
                    :src="`${item.img}`"
                    class="rounded-circle img-fluid"
                  >
                </div> 
                <div
                  class="col-md-8"
                  align="left"
                >
                  <p>{{ item.name }}</p><p>Лет сейчас: {{ item.age }}</p><p>{{ item.status }}</p>
                </div>
                <div
                  class="col-md-2"
                  align="right"
                >
                  <span
                    v-if="(episode.status == 'В процессе') && (current_player_id == item.player_id)"
                    @click="$router.push({ name: 'editpost', params: { id: item.id } })"
                  >
                    <base-button 
                      size="sm"
                      type="primary"
                      icon="fa fa-pencil"
                      title="Отредактировать"
                    />
                  </span>
                  <span
                    v-if="(index == posts.length - 1) && (episode.status == 'В процессе') && (current_player_id == item.player_id)"
                    @click="askForConfirmation(item.id)"
                  >
                    <base-button 
                      size="sm"
                      type="primary"
                      icon="fa fa-trash"
                      title="Удалить пост"
                    /></span>
                  <span
                    v-if="current_player_id != item.player_id"
                    @click="addComment(item.id)"
                  >
                    <base-button 
                      size="sm"
                      type="primary"
                      icon="fa fa-comment-o"
                      title="Оставить комментарий"
                    /></span>
                </div>
              </div>
              <div
                style="white-space:pre-wrap; text-justify: auto;" 
              >
                {{ item.body }}
              </div>
            </card>
            <p />   
          </div>                                         
        </div>
        <div class="row">
          <p />
          <div
            v-if="posts.length > 2"
            class="col-md-12"
            align="right"
          >
            <base-button type="primary" @click.prevent="scrollToTop()">
              ВВЕРХ
            </base-button>
            <p />
          </div>
        </div>
        <div
          v-if="episode.status == 'В процессе'"
          class="row"
        >  
          <div class="col-md-12">
            <textarea
              id="new_post"
              v-model="new_post"
              class="form-control form-control-alternative"
              rows="10" 
              placeholder="Пост писать сюда"
            />
          </div>
        </div>
        <div class="row">
          <p />
        </div>
        <div
          v-if="episode.status == 'В процессе'"
          class="row"
        >
          <div
            class="col-md-6"
            align="left"
          >
            <base-dropdown title="Выбери персонажа">
              <base-button
                slot="title"
                type="primary"
                class="dropdown-toggle"
              >
                {{ current_character.name }}
              </base-button>
              <div
                v-for="ch in characters"
                :key="ch.id"
              >
                <a
                  class="dropdown-item"
                  @click="current_character = {id: ch.id, name: ch.name}"
                >
                  {{ ch.name }}
                </a>
              </div>
            </base-dropdown>
          </div>  
          <div
            class="col-md-6"
            align="right"
          >
            <span @click="addPost(current_character.id)">
              <base-button type="success">
                Добавить
              </base-button>
            </span>
          </div>  
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import "flatpickr/dist/flatpickr.css";
import { viewEpisode, getEpisodePosts, closeEpisode, reopenEpisode, getEpisodeBranches } from '../services/EpisodeService';
import { addPost, deletePost, addComment } from '../services/PostService';
import { getCharacters } from '../services/CharacterService';
import { getPlayer } from '../services/PlayerService';
import BaseButton from '@/components/BaseButton';
import BaseDropdown from '@/components/BaseDropdown';
const UniqueSet = require('@sepiariver/unique-set');

export default {
    name: "ViewEpisode",
    components: { BaseButton, BaseDropdown },
    data() {
        return {
          episode: {
            id: this.$route.params.id,
            name: "",
            description: "",
            timeOfAction: "",
            world: ""
          },
          posts: [],
          branches: [],
          new_post: "",
          current_character: {id: 0, name: "ВЫБЕРИ ПЕРСОНАЖА"},
          characters: [],
          episode_characters:[],
          error: false,
          current_player_id: 0,
          email: ''
        };
      },
      async created() {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            getPlayer(this.email).then(response => {
                this.current_player_id = response[0].id;
                getCharacters(this.current_player_id).then(characters => {
                    this.characters = characters;
                });
                viewEpisode(this.episode.id).then(response => {
                    this.episode.name = response[0].name;
                    this.episode.description = response[0].description;
                    this.episode.timeOfAction = (new Date(response[0].timeOfAction)).toISOString().split('T')[0];
                    this.episode.collection = response[0].branch;
                    this.episode.branch_id = response[0].branch_id;
                    this.episode.world = response[0].world;
                    this.episode.status = response[0].status;
                    this.episode.author_id = response[0].author_id;
                    document.title = response[0].name;
                });
                getEpisodePosts(this.episode.id).then(response => {
                    this.posts = response;
                    this.episode_characters = [...new UniqueSet(response.map(a => ({name: a.name, id: a.char_id})))];
                    if (location.hash) this.$nextTick(() => this.scrollToElement());
                });
                getEpisodeBranches(this.episode.id).then(response => {
                    this.branches = response;
                });
            });
        },
        mounted() {
        },
      methods: {
        scrollToElement() {
            document.getElementById(location.hash).scrollIntoView();
        },
        addPost(character) {
            let processed_text = this.new_post.replace('- ', '— ').replace('  ', ' ');
            const payload = {
                  body: processed_text,
                  added_time: (new Date().toISOString().slice(0, 19).replace('T', ' ')),
                  episode_id: this.episode.id,
                  author_id: character,
              };
              addPost(payload).then(response => {
                if (response.status != 200) this.error = true;
                getEpisodePosts(this.episode.id).then(response => {
                    this.posts = response;
                });
                this.new_post="";
              });
          },
        scrollToTop() {
           window.scrollTo(0,0);
          },
        scrollToBottom() {
          window.scrollTo(0, document.body.scrollHeight);
        },
        closeEpisode() {
          closeEpisode(this.episode.id).then(() => {this.$router.go()});
          
        },
        reopenEpisode() {
          reopenEpisode(this.episode.id).then(() => {this.$router.go()});
        },
        askForConfirmation(postId) {
          if (confirm("Правда удалить пост?")) {
            deletePost(postId).then(() => {
            getEpisodePosts(this.episode.id).then(response => {
                    this.posts = response;
                });
          });
          } 
        },
        addComment(postId) {
          let comment = prompt("Введите текст комментария");
          if (comment != null || comment != "") {
            const payload = {
              post_id: postId,
              body: comment,
              author_id: this.current_player_id
            }
            addComment(postId, payload);
          }
        }  
    }
};
</script>
<style>
</style>
